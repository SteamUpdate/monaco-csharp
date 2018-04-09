/**
 * Это файл с регистрацией необходимых провайдеров
 */
'use strict';

import {WorkerManager} from './workerManager';
import {CSharpWorker} from './csharpWorker';
import {LanguageServiceDefaultsImpl} from './monaco.contribution';
import * as languageFeatures from './languageFeatures';

import Promise = monaco.Promise;
import Uri = monaco.Uri;
import IDisposable = monaco.IDisposable;

export function setupMode(defaults: LanguageServiceDefaultsImpl): void {
    const client = new WorkerManager(defaults);

	const worker: languageFeatures.WorkerAccessor = (...uris: Uri[]): Promise<CSharpWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

    let languageId = defaults.languageId;

    monaco.languages.registerCompletionItemProvider(languageId, new languageFeatures.CompletionAdapter(worker));
    //monaco.languages.registerSignatureHelpProvider(languageId, new languageFeatures.SignatureHelpAdapter());
}