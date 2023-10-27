
export class Exception extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class NoValidIDException extends Exception {
    constructor(entity: string) {
        super(`This ${entity} doesnt have a valid ID`);
    }
}

export class RequestedProductNotAvailableException extends Exception {
    constructor() {
        super("The requested product is not available");
    }
}
