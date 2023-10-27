import { Category } from "../domain/category";
import { Product } from "../domain/product";
import { Stock } from "../domain/stock";
import {
    IncomingTransaction,
    OutgoingTransaction,
} from "../domain/transaction";
import { NoValidIDException } from "../domain/errors";
import {
    IOrderStoragePort,
    IProductStoragePort,
    IStockStoragePort,
    ITransactionStoragePort,
} from "./ports";
import { handleQuery } from "./utils";
import { Order, OrderItemList } from "../domain/order";
import { Supplier } from "../domain/supplier";

//En tant qu'utilisateur, je veux pouvoir ajouter un nouveau produit à la liste des produits, en fournissant son nom, sa description, son code, sa catégorie et son prix unitaire.
export function addProduct(param: {
    data: {
        name: string;
        description: string;
        code: string;
        category: Category;
        price: number;
    };
    storagePort: IProductStoragePort;
}) {
    let product = new Product({
        category: param.data.category,
        code: param.data.code,
        description: param.data.description,
        name: param.data.name,
        price: param.data.price,
    });

    return handleQuery(param.storagePort.save(product));
}

//En tant qu'utilisateur, je veux pouvoir modifier les détails d'un produit existant, y compris son nom, sa description, son code, sa catégorie et son prix unitaire.
export function editProduct(param: {
    data: {
        product: Product;
        name: string;
        description: string;
        code: string;
        category: Category;
        price: number;
    };
    storagePort: IProductStoragePort;
}) {
    if (param.data.product.hasValidID()) {
        param.data.product.code = param.data.code;
        param.data.product.category = param.data.category;
        param.data.product.description = param.data.description;
        param.data.product.name = param.data.name;
        param.data.product.price = param.data.price;
        return handleQuery(param.storagePort.save(param.data.product));
    } else {
        throw new NoValidIDException();
    }
}

//En tant qu'utilisateur, je veux pouvoir supprimer un produit de la liste des produits.
export function deleteProduct(param: {
    data: Product;
    storagePort: IProductStoragePort;
}) {
    return handleQuery(param.storagePort.delete(param.data));
}

//En tant qu'utilisateur, je veux pouvoir rechercher un ou plusieurs produits de la liste des produits.
export function searchProduct(param: {
    data: any;
    storagePort: IProductStoragePort;
}) {
    return handleQuery(param.storagePort.getByCriteria(param.data));
}

//En tant qu'utilisateur, je veux pouvoir enregistrer une entrée de stock pour un produit donné en spécifiant la quantité et la date.
export async function saveIncomingTransaction(param: {
    data: {
        stock: Stock;
        product: Product;
        count: number;
        date: Date;
    };
    ports: {
        stockStorage: IStockStoragePort;
        transactionStorage: ITransactionStoragePort;
    };
}) {
    let transaction = new IncomingTransaction({
        count: param.data.count,
        product: param.data.product,
        date: param.data.date,
    });

    param.data.stock.addTransaction(transaction);

    try {
        await handleQuery(param.ports.transactionStorage.save(transaction));
    } catch (error) {
        param.data.stock.deleteTransaction(transaction);
        throw error;
    }

    return handleQuery(param.ports.stockStorage.save(param.data.stock));
}

//En tant qu'utilisateur, je veux pouvoir enregistrer une sortie de stock pour un produit donné en spécifiant la quantité et la date.
export async function saveOutgoingTransaction(param: {
    data: {
        stock: Stock;
        product: Product;
        count: number;
        date: Date;
    };
    ports: {
        stockStorage: IStockStoragePort;
        transactionStorage: ITransactionStoragePort;
    };
}) {
    let transaction = new OutgoingTransaction({
        count: param.data.count,
        product: param.data.product,
        date: param.data.date,
    });

    try {
        param.data.stock.addTransaction(transaction);
    } catch (error) {
        throw error;
    }

    try {
        await handleQuery(param.ports.transactionStorage.save(transaction));
    } catch (error) {
        param.data.stock.deleteTransaction(transaction);
        throw error;
    }

    return handleQuery(param.ports.stockStorage.save(param.data.stock));
}

//En tant qu'utilisateur, je veux consulter les niveaux de stock actuels de tous les produits.
export function getAllProductsStockLevel(param: {
    data: Stock;
    storagePort: IStockStoragePort;
}) {
    return param.data.products.collection;
}

//En tant qu'utilisateur, je veux créer une commande d'achat en spécifiant les produits à commander et les quantités.
export function createOrder(param: {
    data: {
        list: {
            product: Product;
            count: number;
        }[];
        supplier: Supplier;
    };
}) {
    let orderItems = new OrderItemList();

    param.data.list.forEach((item) => {
        orderItems.setProduct(item.product, item.count);
    });
    let order = new Order({
        date: new Date(),
        items: orderItems,
        status: "Pending",
        supplier: param.data.supplier,
    });

    return order;
}

export function saveOrder(param: {
    storagePort: IOrderStoragePort;
    data: Order;
}) {
    return handleQuery(param.storagePort.save(param.data));
}

export function cancelOrder(param: {
    storagePort: IOrderStoragePort;
    data: Order;
}) {
    try {
        param.data.cancel();
    } catch (error) {
        throw error;
    }

    return handleQuery(param.storagePort.save(param.data));
}

export function deliverOrder(param: {
    storagePort: IOrderStoragePort;
    data: Order;
}) {
    try {
        param.data.deliver();
    } catch (error) {
        throw error;
    }

    return handleQuery(param.storagePort.save(param.data));
}

//En tant qu'utilisateur, je veux consulter l'historique des mouvements de stock d'un produit spécifique.
export function getProductTransactionLog() {}

//En tant qu'utilisateur, je veux générer un rapport indiquant les produits en stock, leurs quantités, leurs valeurs et d'autres détails pertinents.
export function getStockReport() {}
