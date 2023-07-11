
export type PaypalModel = {
    paymentId: string
    paymentManagementId: string
    amount: number
    expirationDate: Date
    status: "PENDING" | "CANCELLED" | "REFUNDED" | "APPROVED"
}

export namespace PaypalModel {
    export type Status = "PENDING" | "CANCELLED" | "REFUNDED" | "APPROVED"
}