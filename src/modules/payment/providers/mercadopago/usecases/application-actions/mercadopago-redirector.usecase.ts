import { MercadopagoGateway } from "../../gateways"
import { ApproveMercadopagoPaymentUsecase } from "./approve-mercadopago-payment"
import { CancelMercadopagoPaymentUsecase } from "./cancel-mercadopago-payment"
import { CreateMercadopagoPaymentUsecase } from "./create-mercadopago-payment"
import { RefundMercadopagoPaymentUsecase } from "./refund-mercadopago-payment"


export class MercadopagoRedirectorUsecase {

    static async execute({ action, paymentId }: MercadopagoRedirectorUsecase.Input): Promise<void> {

        if (action === "payment.created") await CreateMercadopagoPaymentUsecase.execute({ mercadopagoPaymentId: paymentId })

        if (action === "payment.updated") {
            const mercadopagoPayment = await MercadopagoGateway.findById(paymentId)

            if (mercadopagoPayment?.status === "APPROVED") await ApproveMercadopagoPaymentUsecase.execute({ mercadopagoPaymentId: paymentId })
            if (mercadopagoPayment?.status === "CANCELLED") await CancelMercadopagoPaymentUsecase.execute({ mercadopagoPaymentId: paymentId })
            if (mercadopagoPayment?.status === "REFUNDED") await RefundMercadopagoPaymentUsecase.execute({ mercadopagoPaymentId: paymentId })
        }

    }
}

export namespace MercadopagoRedirectorUsecase {
    export type Actions = "payment.created" | "payment.updated"
    export type Input = {
        action: Actions
        paymentId: string
    }
}