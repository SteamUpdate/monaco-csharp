/*
Этот файл является точкой входа для регистрации нового плагина в MonacoEditor.
Тут вызывается функция, которая регистрирует в MonacoEditor необходиые компоненты
*/
'use strict';

import * as mode from './csharpMode';

import Emitter = monaco.Emitter;
import IEvent = monaco.IEvent;
import IDisposable = monaco.IDisposable;

// --- Тут должны быть какие-то дефолтные настройки. Пока не понятно, нужны они нам или нет ---

export class LanguageServiceDefaultsImpl implements monaco.languages.csharp.LanguageServiceDefaults {
    private _languageId: string;
    private _host: string;
    private _workspaceKey: string;

    constructor(languageId: string) {
        this._languageId = languageId;
    }

    get languageId(): string {
		return this._languageId;
    }

    getHost(): string {
        return this._host;
    }

    setHost(value: string): void {
        this._host = value;
    }

    getWorkspaceKey(): string {
        return this._workspaceKey;
    }
    setWorkspaceKey(value: string): void {
        this._workspaceKey = value;
    }
}

const CSharp = "csharp";
const csharpDefaults = new LanguageServiceDefaultsImpl(CSharp);

// Export API
function createAPI(): typeof monaco.languages.csharp {
    return {
        csharpDefaults: csharpDefaults
    }
}

// --- Регистрация в MonacoEditor ---

function getMode(): monaco.Promise<typeof mode> {
    return monaco.Promise.wrap(import('./csharpMode'));
}

monaco.languages.register({
    id: CSharp,
    extensions: ['.cs'],
    aliases: ['cs', CSharp, 'c#', 'CSharp', "C#"]
});

monaco.languages.onLanguage(CSharp, () => {
    return getMode().then(mode => mode.setupMode(csharpDefaults));
});