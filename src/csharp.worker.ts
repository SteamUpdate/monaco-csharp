'use strict'

import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { CSharpWorker } from './csharpWorker';

self.onmessage = () => {
    // ignore the first message
	worker.initialize((ctx, createData) => {
		return new CSharpWorker(ctx, createData)
	});
}