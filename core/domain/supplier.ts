import { Entity } from "./common";

export class Supplier extends Entity {
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    constructor(param: { id?: number; name: string }) {
        super({ id: param.id });
        this.name = param.name;
    }
}
