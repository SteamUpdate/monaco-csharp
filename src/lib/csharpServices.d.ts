/**
 * Файл со всеми моделями и интерфейсами для работы этого модуля
 */

import Promise = monaco.Promise;
import Position = monaco.Position;

declare namespace csharp {
    interface LanguageService {
        getCompletionItems(fileName: string, buffer: string, position: Position): Promise<CompletionInfo>;
    }

    /**
     * Список моделей для работы с автокомплитом
     */
    interface CompletionInfo {
        entries: CompletionEntry[];
    }

    /**
     * Модель для работы с автокомплитом
     */
    interface CompletionEntry {
        text: string;
        description: string;
        kind: string;
        returnType: string;
    }

    interface AutocompleteRequest{
        Line: string;
        Column: string;
        Buffer: string;
        FileName: string;
        WorkspaceKey: string;
        WordToComplete?: string;
        WantDocumentationForEveryCompletionResult?: string;
        WantImportableTypes?: string;
        WantMethodHeader?: string;
        WantSnippet?: string;
        WantReturnType?: string;
        WantKind?: string;
        TriggerCharacter?: string;
    }

    interface ElmaRequest {
        postData: string;
        command: string;
    }
}

export = csharp;