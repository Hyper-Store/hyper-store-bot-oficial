import { Database } from "@/infra/app/setup-database"
import { ProductStockModel } from "../models/product-stock.model"
import { randomUUID } from "crypto"

export class ProductStockRepository {
    static async add(productId: string, stock: ProductStockModel): Promise<void> {
        stock.id = randomUUID()

        new Database().push(`products.${productId}.stock`, stock)
    }

    static async findById(productId: string, stockId: string): Promise<ProductStockModel | null> {
        const result = new Database().get(`products.${productId}.${stockId}`)
        return result as ProductStockModel ?? null
    }

    static async update(productId: ProductStockModel, stockId: string, stock: ProductStockModel): Promise<void> {
        new Database().set(`products.${productId}.stock[${stockId}]`, stock)
    }
}