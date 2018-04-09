/*
Это файл с реализациями необходимых провайдеров.
Тут идёт обработка данных извне и преобразование их в модели MonacoEditor
*/

'use strict';

import {LanguageServiceDefaultsImpl} from './monaco.contribution';
import {CSharpWorker} from './csharpWorker';

import Uri = monaco.Uri;
import Position = monaco.Position;
import Range = monaco.Range;
import Thenable = monaco.Thenable;
import Promise = monaco.Promise;
import CancellationToken = monaco.CancellationToken;
import IDisposable = monaco.IDisposable;

export interface WorkerAccessor {
	(...more: Uri[]): Promise<CSharpWorker>
}

export class CompletionAdapter implements monaco.languages.CompletionItemProvider {
    constructor(private _worker: WorkerAccessor) {
    }

    public get triggerCharacters(): string[] {
		return ['.'];
    }

    protected _positionToOffset(uri: Uri, position: monaco.IPosition): number {
		let model = monaco.editor.getModel(uri);
		return model.getOffsetAt(position);
	}

    provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.CompletionItem[]> {
        const resource = model.uri;
        return wireCancellationToken(token, this._worker(resource).then(worker => {
			return worker.getCompletionItems(resource.toString(), model.getValue(), position);
		}).then(info => {
			if (!info) {
				return;
            }
            //тут идёт мапинг полученных элементов в модель редактора
			let items: monaco.languages.CompletionItem[] = info.entries.map(entry => {
				let item : monaco.languages.CompletionItem = {
					label: entry.text,
                    documentation: entry.description,
                    // возможно, придётся писать свою функцию для конвертации типов
                    kind: monaco.languages.CompletionItemKind[entry.kind],
                    detail: entry.returnType
                };

                // Возможно, без этих строк кода не будет работать снипет. Надо проверить
				// if (entry.textEdit) {
				// 	item.range = toRange(entry.textEdit.range);
				// 	item.insertText = entry.textEdit.newText;
				// }
				// if (entry.insertTextFormat === ls.InsertTextFormat.Snippet) {
				// 	item.insertText = { value: <string> item.insertText };
                // }

				return item;
			});

			return items;
        }));

    }
}

export class SignatureHelpAdapter implements monaco.languages.SignatureHelpProvider {

    public signatureHelpTriggerCharacters = ['(', ','];

    provideSignatureHelp(model: monaco.editor.IReadOnlyModel, position: Position, token: CancellationToken): Thenable<monaco.languages.SignatureHelp> {
        return null;
    }
}

/**
 * Hook a cancellation token to a WinJS Promise
 */
function wireCancellationToken<T>(token: CancellationToken, promise: Promise<T>): Thenable<T> {
	token.onCancellationRequested(() => promise.cancel());
	return promise;
}