'use strict'

import * as csharp from './csharpServices.d';
import Promise = monaco.Promise;
import Position = monaco.Position;

export class CSharpLanguageService implements csharp.LanguageService {

    private _host: string;
    private _workspaceKey: string;

    /**
     *
     */
    constructor(host: string, workspaceKey: string) {
        this._host = host;
        this._workspaceKey = workspaceKey;
    }

    getCompletionItems(fileName: string, buffer: string, position: Position): Promise<csharp.CompletionInfo> {
        return new Promise(resolve => {
            let data: csharp.AutocompleteRequest = {
                Line: position.lineNumber.toString(),
                Column: position.column.toString(),
                FileName: fileName,
                Buffer: buffer,
                WorkspaceKey: this._workspaceKey
            };

            let postData: csharp.ElmaRequest = {
                postData: JSON.stringify(data),
                command: "autocomplete"
            };

            var xhr = new XMLHttpRequest();
            xhr.open("POST", this._host, true);

            xhr.onload = () => {
                resolve(xhr.responseText);
            };

            // либо отправится так, либо придётся ещё раз через JSON.stringify прогонять
            xhr.send(postData);
         }).then(responseText => {
            let info: csharp.CompletionInfo;
            var response = JSON.parse(responseText);
                info = response.map(item => {
                    let entry: csharp.CompletionEntry = {
                        text: item.CompletionText,
                        description: item.Description,
                        kind: item.Kind,
                        returnType: item.returnType
                    }
                    return entry;
                });
            return info;
         });
    }
}