export type CheckoutModel = {
    id: string,
    ref?: string,
    ownerId: string
    productId: string
    quantity?: number,
    price?: number,
    status?: CheckoutModel.Status,
    review?: number | null,
    createdAt?: Date,
}

export namespace CheckoutModel {
    export type Status = "PENDING" | "APPROVED" | "CANCELLED"
}