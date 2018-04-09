declare module monaco.languages.csharp {
    export interface LanguageServiceDefaults {
        getHost(): string;
        setHost(value: string): void;
        getWorkspaceKey(): string;
        setWorkspaceKey(value: string): void;
    }

    export var csharpDefaults: LanguageServiceDefaults;
}