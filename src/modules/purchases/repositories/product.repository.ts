import { Database } from "@/infra/app/setup-database"
import { ProductModel } from "../models/product.model"

export class ProductRepository {
    static async create(product: ProductModel): Promise<void> {
        new Database().set(`products.${product.id}`, product)
    }

    static async findById(productId: string): Promise<ProductModel | null> {
        const result = new Database().get(`products.${productId}`)
        return result as ProductModel ?? null
    }

    static async update(product: ProductModel): Promise<void> {
        new Database().set(`products.${product.id}`, product)
    }
}