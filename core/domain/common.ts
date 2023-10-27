export function generateCode() {
    return "";
}

export interface Item<TItem> {
    [code: string]: TItem;
}

export interface IItemIterator<TItem> {
    getNext(): TItem;
    hasMore(): boolean;
}

export interface IItemIteratorCollection<TItem> {
    createIterator(): IItemIterator<TItem>;
}

class ItemIterator<TItem> implements IItemIterator<TItem> {
    private keyList: string[];
    private currentPosition: number;
    private itemList: Item<TItem>;
    private collection: ItemCollection<TItem>;

    constructor(param: { collection: ItemCollection<TItem> }) {
        this.collection = param.collection;
        this.currentPosition = 0;
        this.initItems();
    }

    initItems() {
        this.itemList = this.collection.items;
        this.keyList = [];
        for (const key in this.itemList) {
            this.keyList.push(key);
        }
    }

    getNext(): TItem {
        let item = this.itemList[this.keyList[this.currentPosition]];
        this.currentPosition++;
        return item;
    }
    hasMore(): boolean {
        return this.currentPosition < this.keyList.length;
    }
}

export class ItemCollection<TItem> implements IItemIteratorCollection<TItem> {
    private _items: Item<TItem>;
    public get items(): Item<TItem> {
        return this._items;
    }
    public set items(value: Item<TItem>) {
        this._items = value;
    }

    constructor() {
        this.items = {};
    }

    createIterator(): IItemIterator<TItem> {
        return new ItemIterator<TItem>({
            collection: this,
        });
    }

    setItem(code: string, item: TItem) {
        this.items[code] = item;
    }

    removeItem(code: string) {
        delete this.items[code];
    }

    getItem(code: string) {
        return this.items[code];
    }

    hasItem(code: string) {
        return !!this.items[code];
    }

    forEach(callback: (item: TItem) => void) {
        let iterator = this.createIterator();

        while (iterator.hasMore()) {
            let item = iterator.getNext();
            callback(item);
        }
    }
}

export class Entity {
    static DEFAULT_ID = -1;

    private _id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    constructor(param: { id?: number }) {
        this.id = param.id ?? Entity.DEFAULT_ID;
    }

    hasValidID() {
        return this.id !== Entity.DEFAULT_ID;
    }
}
