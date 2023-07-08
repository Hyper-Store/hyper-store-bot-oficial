import { Database } from "@/infra/app/setup-database";
import { MercadopagoModel } from "../models";


export class MercadopagoRepository {

    static async findByPaymentId(mercadopagoPaymentId: string): Promise<MercadopagoModel | null> {
        const database = new Database()
        const result = database.get(`purchases.payment.mercadopago.ref-${mercadopagoPaymentId}`)
        return result as MercadopagoModel ?? null
    }

    static async create(mercadopagoPayment: MercadopagoModel): Promise<void> {
        new Database().set(`payment.mercadopago.ref-${mercadopagoPayment.paymentId}`, mercadopagoPayment)
    }
}