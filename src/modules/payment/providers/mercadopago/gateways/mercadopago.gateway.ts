import { MercadopagoModel } from "../models";
import * as mercadopago from 'mercadopago';

const getStatus = (status: string): MercadopagoModel.Status =>  {
    if(status === "approved"){
        return "APPROVED"
    }
    if(status === "pending"){
        return "PENDING"
    }
    if(status === "refunded"){
        return "REFUNDED"
    }
    if(status === "cancelled"){
        return "CANCELLED"
    }

    return "CANCELLED"
}


export class MercadopagoGateway {

    static async findById(id: string): Promise<MercadopagoModel | null> {

        try{
            const payment = await mercadopago.payment.findById(parseInt(id))
            const expirationDate = new Date(payment.body.metadata.expiration_date)
            return {
                paymentId: `${payment.body.id}`,
                amount: payment.body.metadata.amount,
                paymentProviderId:  payment.body.metadata.order_payment_id,
                status: getStatus(payment.body.status),
                expirationDate,
            }
        }catch(err){
            return null
        }

    }
}