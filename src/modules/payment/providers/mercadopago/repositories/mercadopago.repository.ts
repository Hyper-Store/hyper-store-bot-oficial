import { Database } from "@/infra/app/setup-database";
import { MercadopagoModel } from "../models";


export class MercadopagoRepository {

    static async findByPaymentId(mercadopagoPaymentId: string): Promise<MercadopagoModel | null> {
        const database = new Database()
        const result = database.get(`purchases.payment.mercadopago.${mercadopagoPaymentId}`)
        return result as MercadopagoModel ?? null
    }

    static async create(mercadopagoPayment: MercadopagoModel): Promise<void> {
        const database = new Database()
        database.set(`purchases.payment.mercadopago.${mercadopagoPayment.paymentId}`, mercadopagoPayment)
    }
}