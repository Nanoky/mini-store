import { Entity, ItemCollection, generateCode } from "./common";
import { Product } from "./product";
import { Supplier } from "./supplier";

export type TOrderStatus = "Pending" | "Delivered" | "Cancelled";

export type OrderItem = {
    product: Product;
    count: number;
    amount: number;
};

export class OrderItemList {
    private _collection: ItemCollection<OrderItem>;
    public get collection(): ItemCollection<OrderItem> {
        return this._collection;
    }
    public set collection(value: ItemCollection<OrderItem>) {
        this._collection = value;
    }

    constructor() {
        this.collection = new ItemCollection();
    }

    setProduct(product: Product, count: number) {
        if (this.collection.hasItem(product.code)) {
            this.collection.getItem(product.code).count += count;
        } else {
            this.collection.setItem(product.code, {
                count: count,
                product: product,
                amount: 0,
            });
        }

        this.setProductAmount(product);
    }

    removeProduct(product: Product) {
        this.collection.removeItem(product.code);
    }

    private setProductAmount(product: Product) {
        let item = this.collection.getItem(product.code);
        item.amount = item.product.price * item.count;
    }

    computeTotalAmount() {
        let amount = 0;

        this.collection.forEach((item) => {
            amount += item.amount;
        });

        return amount;
    }
}

export class Order extends Entity {
    private _items: OrderItemList;
    private _code: string;
    private _date: Date;
    private _status: TOrderStatus;
    private _supplier: Supplier;

    constructor(param: {
        id?: number;
        code?: string;
        items: OrderItemList;
        date: Date;
        status: TOrderStatus;
        supplier: Supplier;
    }) {
        super({ id: param.id });
        this.code = param.code ?? generateCode();
        this.items = param.items;
        this.date = param.date;
        this.status = param.status;
        this.supplier = param.supplier;
    }

    public get supplier(): Supplier {
        return this._supplier;
    }
    public set supplier(value: Supplier) {
        this._supplier = value;
    }
    public get status(): TOrderStatus {
        return this._status;
    }
    public set status(value: TOrderStatus) {
        this._status = value;
    }

    public get date(): Date {
        return this._date;
    }
    public set date(value: Date) {
        this._date = value;
    }

    public get items(): OrderItemList {
        return this._items;
    }
    public set items(value: OrderItemList) {
        this._items = value;
    }

    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }

    // add or edit item
    addOrEditItem(product: Product, count: number) {
        this.items.setProduct(product, count);
    }

    // remove item
    removeItem(product: Product) {
        this.items.removeProduct(product);
    }

    getAmount() {
        return this.items.computeTotalAmount();
    }

    cancel() {
        if (this.status === "Pending") this.status = "Cancelled";
    }

    deliver() {
        this.status = "Delivered";
    }
}
