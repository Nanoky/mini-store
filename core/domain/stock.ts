import { Entity, ItemCollection, generateCode } from "./common";
import { RequestedProductNotAvailableException } from "./errors";
import { Product } from "./product";
import { Transaction } from "./transaction";

type ProductItem = {
    item: Product;
    count: number;
};

class ProductItemList {
    private _collection: ItemCollection<ProductItem>;
    public get collection(): ItemCollection<ProductItem> {
        return this._collection;
    }
    private set collection(value: ItemCollection<ProductItem>) {
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
                item: product,
            });
        }
    }

    removeProduct(product: Product) {
        this.collection.removeItem(product.code);
    }
}

export class Stock extends Entity {
    private _products: ProductItemList;
    private _transactions: Transaction[];

    constructor(param: {
        products?: ProductItemList;
        transactions: Transaction[];
        id?: number;
    }) {
        super({ id: param.id });
        this.products = param.products ?? new ProductItemList();
        this.transactions = param.transactions;
    }

    public get products(): ProductItemList {
        return this._products;
    }
    public set products(value: ProductItemList) {
        this._products = value;
    }

    public get transactions(): Transaction[] {
        return this._transactions;
    }
    public set transactions(value: Transaction[]) {
        this._transactions = value;
    }

    // add or update product
    addOrEditProduct(product: Product, count: number) {
        this.products.setProduct(product, count);
    }

    // delete product
    removeProduct(product: Product) {
        this.products.removeProduct(product);
    }

    // add transaction
    addTransaction(transaction: Transaction) {
        if (transaction.isOutgoing()) {
            // there are more product than needed to out in the stock
            if (
                this.products.collection.getItem(transaction.product.code)
                    .count > transaction.count
            ) {
                this.addOrEditProduct(transaction.product, -transaction.count);
            } else {
                throw new RequestedProductNotAvailableException();
            }
        }

        if (transaction.isIncoming()) {
            this.addOrEditProduct(transaction.product, transaction.count);
        }

        this.transactions.push(transaction);
    }

    // delete transaction
    deleteTransaction(transaction: Transaction) {
        this.transactions = this.transactions.filter((trans) => {
            return trans.code !== transaction.code;
        });
    }
}
