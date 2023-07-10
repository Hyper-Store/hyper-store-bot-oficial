import * as paypal from "paypal-rest-sdk"
import { PaypalModel } from "../models";

paypal.configure({
    mode: 'live', //sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID!,
    client_secret: process.env.PAYPAL_CLIENT_SECRET!
});

export class PaypalGateway {
    
    
    static async create({ amount }: PaypalGateway.CreateInput): Promise<PaypalGateway.CreateOutput> {
          
        let create_payment_json: paypal.Payment = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: "http://youtube.com",
                cancel_url: "http://youtube.com"
            },
            transactions: [{
                amount: {
                    currency: "BRL",
                    total: `${amount}`
                },
            }]
        };

        const payment: any = await new Promise( async (resolve, reject) => {
            paypal.payment.create(create_payment_json, function (error, payment) {
                console.log(error)
                if (error) reject(error) 
                else resolve(payment)
            });
        })

        console.log(payment)
        return {
            paymentLink: payment.links[1].href,
            paymentId: payment.id
        }
    }

    
}

export namespace PaypalGateway {

    export type CreateInput = {
        amount: number,

    }

    export type CreateOutput = {
        paymentLink: string
        paymentId: string
    }
}