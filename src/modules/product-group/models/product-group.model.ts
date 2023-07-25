import { ProductModel } from "@/modules/product/models/product.model"

export type ProductGroupModel = {
    id?: string,
    title: string,
    description?: string
    channelId?: string,
    messageId?: string,
    image?: string,
    products: ProductModel["id"][]
}