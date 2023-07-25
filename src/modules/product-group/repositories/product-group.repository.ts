import { Database } from "@/infra/app/setup-database"
import { randomUUID } from "crypto"
import { ProductGroupModel } from "../models/product-group.model"
import { ProductModel } from "@/modules/product/models/product.model"
import { ProductRepository } from "@/modules/product/repositories/product.repository"

export class ProductGroupRepository {
    static async create(productGroup: ProductGroupModel): Promise<ProductGroupModel> {
        productGroup.id = randomUUID()
        productGroup.placeholder = productGroup.placeholder ?? "💚 Escolha um produto"

        await new Database().set(`product-groups.${productGroup.id}`, productGroup)
        return productGroup
    }

    static async findById(productGroupId: string): Promise<ProductGroupModel | null> {
        const result = new Database().get(`product-groups.${productGroupId}`)
        return result as ProductGroupModel ?? null
    }

    static async update(productGroup: ProductGroupModel): Promise<ProductGroupModel> {
        const result = await new Database().set(`product-groups.${productGroup.id}`, productGroup)
        return result as ProductGroupModel
    }

    static async delete(productGroupId: string): Promise<void> {
        new Database().delete(`product-groups.${productGroupId}`);
    }

    static async getAll(): Promise<ProductGroupModel[] | []> {
        const result = new Database().get(`product-groups`)
        return result as ProductGroupModel[] ?? []
    }

    static async checkProductIsInGroup(productId: string): Promise<ProductModel | null> {
        const productGroups = await this.getAll();
        const productGroupsLists: ProductGroupModel[] = []

        for (const group of Object.keys(productGroups)) {
            const group_id = group as any
            productGroupsLists.push({ ...productGroups[group_id] })
        }

        for (const group of productGroupsLists) {
            const productIdSearch = group.products.find(p => p === productId)
            const productSearch = await ProductRepository.findById(productIdSearch!);
            if (productSearch) return productSearch;
        }

        return null;
    }
}