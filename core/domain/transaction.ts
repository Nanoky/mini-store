import { generateCode } from "./common";
import { Product } from "./product";

export type TransactionType = "incoming" | "outgoing";
export const INCOMING_TRANSACTION_TYPE: TransactionType = "incoming";
export const OUTGOING_TRANSACTION_TYPE: TransactionType = "outgoing";

export class Transaction {
    private _code: string;
    private _date: Date;
    private _type: TransactionType;
    private _product: Product;
    private _count: number;
    private _amount: number;

    constructor(param: {
        code?: string;
        date?: Date;
        type: TransactionType;
        product: Product;
        count: number;
    }) {
        this.code = param.code ?? generateCode();
        this.date = param.date ?? new Date();
        this.product = param.product;
        this.count = param.count;
        this.amount = this.product.price * this.count;
    }

    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }

    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }

    public get type(): TransactionType {
        return this._type;
    }
    public set type(value: TransactionType) {
        this._type = value;
    }

    public get product(): Product {
        return this._product;
    }
    public set product(value: Product) {
        this._product = value;
    }

    public get count(): number {
        return this._count;
    }
    public set count(value: number) {
        this._count = value;
    }

    public get amount(): number {
        return this._amount;
    }
    public set amount(value: number) {
        this._amount = value;
    }

    isIncoming() {
        return this.type === INCOMING_TRANSACTION_TYPE;
    }

    isOutgoing() {
        return this.type === OUTGOING_TRANSACTION_TYPE;
    }
}

export class IncomingTransaction extends Transaction {
    constructor(param: { date?: Date; product: Product; count: number }) {
        super({
            date: param.date,
            product: param.product,
            count: param.count,
            type: INCOMING_TRANSACTION_TYPE,
        });
    }
}

export class OutgoingTransaction extends Transaction {
    constructor(param: { date?: Date; product: Product; count: number }) {
        super({
            date: param.date,
            product: param.product,
            count: param.count,
            type: OUTGOING_TRANSACTION_TYPE,
        });
    }
}
