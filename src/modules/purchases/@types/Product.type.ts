import { ProductStockType } from "./ProductStock.type"

export type ProductType = {
    id: string,
    title: string,
    description: string,
    image?: string
    price: number,
    stock: ProductStockType[],
    createdAt?: Date,
    channelId?: string,
    messageId?: string
}