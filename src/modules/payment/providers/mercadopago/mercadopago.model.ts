
export type MercadopagoModel = {
    id: string
    mercadopagoPaymentId: string
    status: "PENDING" | "CANCELLED" | "REFUNDED" | "APPROVED"

}