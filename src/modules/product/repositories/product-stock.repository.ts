import { Database } from "@/infra/app/setup-database"
import { ProductStockModel } from "../models/product-stock.model"
import { randomUUID } from "crypto"

export class ProductStockRepository {
    static async add(productId: string, stock: ProductStockModel): Promise<void> {
        stock.id = randomUUID()

        new Database().set(`products.${productId}.stock.${stock.id}`, stock)
    }

    static async findById(productId: string, stockId: string): Promise<ProductStockModel | null> {
        const result = new Database().get(`products.${productId}.${stockId}`)
        return result as ProductStockModel ?? null
    }

    static async update(productId: ProductStockModel, stockId: string, stock: ProductStockModel): Promise<void> {
        new Database().set(`products.${productId}.stock[${stockId}]`, stock)
    }

    static async stockCount(productId: string): Promise<number> {
        const result: ProductStockModel[] | null = new Database().get(`products.${productId}.stock`) as ProductStockModel[] | null

        return result && Object.keys(result!) ? Object.keys(result!).length : 0
    }

    static async delete(productId: string, stockId: string): Promise<void> {
        new Database().delete(`products.${productId}.stock.${stockId}`);
    }
}