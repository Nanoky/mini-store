import { Category } from "./category";
import { Entity } from "./common";

export class Product extends Entity {
    private _code: string;
    private _name: string;
    private _description: string;
    private _price: number;
    private _category: Category;

    constructor(param: {
        id?: number;
        code: string;
        name: string;
        description: string;
        price: number;
        category: Category;
    }) {
        super({
            id: param.id,
        });
        this.code = param.code;
        this.name = param.name;
        this.description = param.description;
        this.price = param.price;
        this.category = param.category;
    }

    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }

    public get category(): Category {
        return this._category;
    }
    public set category(value: Category) {
        this._category = value;
    }
}
