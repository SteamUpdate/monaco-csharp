/**
 * Тут вызываются методы специфичного LanguageService.
 * Методы LanguageService делают запросы к серверу автокомплита (в данном случае, к OmniSharp)
 */

'use strict';

import Promise = monaco.Promise;
import Thenable = monaco.Thenable;
import Position = monaco.Position;
import IWorkerContext = monaco.worker.IWorkerContext;
import * as csharp from './lib/csharpServices.d';
import { CSharpLanguageService } from './lib/csharpServices';

/*
Собственно, рабочий элемент. Тут методы, отправляющие запросы на сервер OmniSharp
*/
export class CSharpWorker {

    private _ctx:IWorkerContext;
	private _languageService: csharp.LanguageService;
	private _languageId: string;

    constructor(ctx: IWorkerContext, createData: ICreateData) {
        this._languageService = new CSharpLanguageService(createData.host, createData.workspaceKey);
    }

    /*
    Функция для получения значений автокомплита
    */
    getCompletionItems(fileName: string, buffer: string, position: Position): Promise<csharp.CompletionInfo> {
        return this._languageService.getCompletionItems(fileName, buffer, position);
    }

    /*
    Функция для получения описания сигнатуры метода
    */
    getSignatureHelpItems(fileName: string, position: Position): Thenable<monaco.languages.SignatureHelp> {
        return null;
    }
}

export interface ICreateData {
    host: string;
    workspaceKey: string;
}