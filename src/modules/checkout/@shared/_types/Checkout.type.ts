export type CheckoutType = {
    id: string,
    ownerId: string
    productId: string
    quantity: number
    status: "pending" | "approved" | "cancelled",
    createdAt: Date,
}