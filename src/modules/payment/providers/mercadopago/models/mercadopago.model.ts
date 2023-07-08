
export type MercadopagoModel = {
    paymentId: string
    paymentProviderId: string
    amount: number
    expirationDate: Date
    status: "PENDING" | "CANCELLED" | "REFUNDED" | "APPROVED"
}

export namespace MercadopagoModel {

    export type Status = "PENDING" | "CANCELLED" | "REFUNDED" | "APPROVED"
}