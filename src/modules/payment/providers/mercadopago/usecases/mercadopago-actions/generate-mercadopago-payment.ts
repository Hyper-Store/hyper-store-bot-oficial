import * as mercadopago from 'mercadopago';
import "dotenv/config"
import { PaymentManagementRepository } from '@/modules/payment/management/repositories';

mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    client_id: process.env.MERCADOPAGO_CLIENT_ID,
    client_secret: process.env.MERCADOPAGO_CLIENT_SECRET
});

export class GenerateMercadopagoPaymentUsecase {

    async execute({ product, customer, paymentManagementId }: GenerateMercadopagoPaymentUsecase.Input) {

        const totalPrice = product.price
        const minutes = 10  // 1 hour

        const expirationDate = new Date()
        expirationDate.setMinutes(expirationDate.getMinutes() + minutes)

        const payment = await mercadopago.payment.create({
            date_of_expiration: expirationDate.toISOString(),
            callback_url: process.env.MERCADOPAGO_REDIRECT_URL!,
            installments: 1,
            transaction_amount: totalPrice,
            payment_method_id: "pix",
 
            payer: {
                email: customer.email
            },
            metadata: {
                expirationDate: expirationDate,
                paymentManagementId,
                amount: totalPrice,
                paymentMethod: "pix"
            },

        })

        const qrCode = payment.body.point_of_interaction.transaction_data.qr_code_base64
        const pixCode = payment.body.point_of_interaction.transaction_data.qr_code
        const paymentLink = payment.body.point_of_interaction.transaction_data.ticket_url

        return {
            paymentId: `${payment.body.id}`,
            data: {
                qrCode,
                pixCode,
                paymentLink
            }
        }

    }
}


export namespace GenerateMercadopagoPaymentUsecase {

    export type Product = {
        title: string
        price: number
    }

    export type Customer = {
        email: string
    }

    export type Input = {
        product: Product
        customer: Customer
        paymentManagementId: string
    }
}