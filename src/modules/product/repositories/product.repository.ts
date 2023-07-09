import { Database } from "@/infra/app/setup-database"
import { ProductModel } from "../models/product.model"
import { randomUUID } from "crypto"

export class ProductRepository {
    static async create(product: ProductModel): Promise<ProductModel> {
        product.id = randomUUID()
        product.createdAt = new Date()

        const result = await new Database().set(`products.${product.id}`, product)

        return result as ProductModel;
    }

    static async findById(productId: string): Promise<ProductModel | null> {
        const result = new Database().get(`products.${productId}`)
        return result as ProductModel ?? null
    }

    static async update(product: ProductModel): Promise<void> {
        new Database().set(`products.${product.id}`, product)
    }

    static async getAll(): Promise<ProductModel[] | []> {
        const result = new Database().get(`products`)

        return result as ProductModel[] ?? []
    }
}