import { ProductStockModel } from "./product-stock.model"

export type ProductModel = {
    id?: string,
    title: string,
    description: string,
    image?: string
    price: number,
    stock?: ProductStockModel[],
    createdAt?: Date,
    channelId?: string,
    messageId?: string
}