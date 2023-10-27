import { generateCode } from "./common";

export class Category {
    private _code: string;
    private _name: string;

    constructor(param: { name: string }) {
        this.code = generateCode();
        this.name = param.name;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }
}
