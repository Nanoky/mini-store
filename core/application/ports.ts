import { Category } from "../domain/category";
import { Order } from "../domain/order";
import { Product } from "../domain/product";
import { Stock } from "../domain/stock";
import { Transaction, TransactionType } from "../domain/transaction";

export type Response<TData> = {
    isSuccess: boolean;
    message: string;
    data: TData;
};

export interface IStoragePort {
    save(data: any): Promise<Response<any>>;
    delete(data: any): Promise<Response<any>>;
    getByCriteria(data: any): Promise<Response<any>>;
}

export type TSearchProductParam = {
    id?: string;
    code?: string;
    category?: Category;
    minPrice?: number;
    maxPrice?: number;
    textPattern?: string;
}
export interface IProductStoragePort extends IStoragePort {
    save(data: Product): Promise<Response<Product>>;
    delete(data: Product): Promise<Response<any>>;
    getByCriteria(data: TSearchProductParam): Promise<Response<Product[]>>;
}

export type TSearchStockParam = {
    id?: number;
}
export interface IStockStoragePort extends IStoragePort {
    save(data: Stock): Promise<Response<Stock>>;
    getByCriteria(data: TSearchStockParam): Promise<Response<Stock[]>>;
}

export type TSearchTransactionParam = {
    code: string;
    startDate: Date;
    endDate: Date;
    type: TransactionType;
    product: Product;
}
export interface ITransactionStoragePort extends IStoragePort {
    save(data: Transaction): Promise<Response<Transaction>>;
    delete(data: Transaction): Promise<Response<any>>;
    getByCriteria(data: TSearchTransactionParam): Promise<Response<Transaction>>;
}

export interface IOrderStoragePort extends IStoragePort {
    save(data: Order): Promise<Response<Order>>;
    delete(data: Order): Promise<Response<any>>;
    getByCriteria(data: any): Promise<Response<Order[]>>;
}
