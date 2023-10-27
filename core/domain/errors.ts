
export class Exception extends Error {
    private _type: string;
    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }
    constructor(message: string) {
        super(message);
    }
}

export class NoValidIDException extends Exception {
    constructor(entity: string) {
        super(`This ${entity} doesnt have a valid ID`);
        this.type = "Id invalid exception";
    }
}

export class RequestedProductNotAvailableException extends Exception {
    constructor() {
        super("The requested product is not available");
        //this.type = REQUESTED_PRODUCT_NOT_AVAILABLE_EXCEPTION
    }
}
