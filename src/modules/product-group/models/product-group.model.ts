import { ProductModel } from "@/modules/product/models/product.model"

export type ProductGroupModel = {
    id?: string,
    channelId?: string,
    messageId?: string,
    placeholder?: string,
    products: ProductModel["id"][]
}