import { MercadopagoModel } from "../models";
import * as mercadopago from 'mercadopago';
import "dotenv/config"

mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    client_id: process.env.MERCADOPAGO_CLIENT_ID,
    client_secret: process.env.MERCADOPAGO_CLIENT_SECRET
});

const getStatus = (status: string): MercadopagoModel.Status => {
    if (status === "approved") {
        return "APPROVED"
    }
    if (status === "pending") {
        return "PENDING"
    }
    if (status === "refunded") {
        return "REFUNDED"
    }
    if (status === "cancelled") {
        return "CANCELLED"
    }

    return "CANCELLED"
}

export class MercadopagoGateway {

    static async findById(id: string): Promise<MercadopagoModel | null> {
        try {
            const payment = await mercadopago.payment.findById(parseInt(id))
            const expirationDate = new Date(payment.body.metadata.expiration_date)
            return {
                paymentId: `${payment.body.id}`,
                amount: payment.body.metadata.amount,
                paymentProviderId: payment.body.metadata.payment_provider_id,
                status: getStatus(payment.body.status),
                expirationDate,
            }
        } catch (err) {
            return null
        }

    }
}