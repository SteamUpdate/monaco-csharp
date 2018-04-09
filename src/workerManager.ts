/**
 * Менеджер работы с воркером
 */
'use strict'

import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import {CSharpWorker} from './csharpWorker';

import Promise = monaco.Promise;
import Uri = monaco.Uri;

export class WorkerManager {

	private _modeId: string;
	private _defaults: LanguageServiceDefaultsImpl;
	private _idleCheckInterval: number;

	private _worker: monaco.editor.MonacoWebWorker<CSharpWorker>;
	private _client: Promise<CSharpWorker>;

    constructor(defaults: LanguageServiceDefaultsImpl) {
		this._defaults = defaults;
		this._modeId = defaults.languageId;
		this._worker = null;
	}

	private _getClient(): Promise<CSharpWorker> {
		if (!this._client) {
			this._worker = monaco.editor.createWebWorker<CSharpWorker>({

				// module that exports the create() method and returns a `CSharpWorker` instance
				moduleId: 'vs/language/csharp/csharpWorker',

				label: this._modeId,

				createData: {
					host: this._defaults.getHost(),
					workspaceKey: this._defaults.getWorkspaceKey()
				}
			});

			this._client = this._worker.getProxy();
		}

		return this._client;
	}

    getLanguageServiceWorker(...resources: Uri[]): Promise<CSharpWorker> {
		let _client: CSharpWorker;
		return toShallowCancelPromise(
			this._getClient().then((client) => {
				_client = client
			}).then(_ => {
				return this._worker.withSyncedResources(resources)
			}).then(_ => _client)
		);
	}
}

function toShallowCancelPromise<T>(p: Promise<T>): Promise<T> {
	let completeCallback: (value: T) => void;
	let errorCallback: (err: any) => void;

	let r = new Promise<T>((c, e) => {
		completeCallback = c;
		errorCallback = e;
	}, () => { });

	p.then(completeCallback, errorCallback);

	return r;
}
