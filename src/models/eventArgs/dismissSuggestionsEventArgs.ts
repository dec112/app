export class DismissSuggestionsEventArgs {
    private _sendImmediately: boolean;
    private _text: string;

    constructor(sendImmediately: boolean, text: string) {
        this._sendImmediately = sendImmediately;
        this._text = text;
    }

    get sendImmediately(): boolean {
        return this._sendImmediately;
    }

    get text(): string {
        return this._text;
    }
}