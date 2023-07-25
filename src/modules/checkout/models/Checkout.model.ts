import { ProductStockModel } from "@/modules/product/models/product-stock.model"

export type CheckoutModel = {
    id: string,
    ref?: string,
    ownerId: string
    productId: string
    quantity?: number,
    price?: number,
    status?: CheckoutModel.Status,
    review?: number | null,
    reviewSent?: boolean,
    paymentId?: string,
    stocks?: ProductStockModel[]
    createdAt?: Date,
}

export namespace CheckoutModel {
    export type Status = "PENDING" | "APPROVED" | "CANCELLED"
}