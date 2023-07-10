import { PaypalGateway } from "../../gateways"


export class GeneratePaypalPaymentUsecase {

    static async execute({ amount }: GeneratePaypalPaymentUsecase.Input): Promise<GeneratePaypalPaymentUsecase.Output> {

        const { paymentId, paymentLink } = await PaypalGateway.create({ amount })

        return { 
            paymentId,
            data: {
                paymentLink,
            }
        } 
    }
}

export namespace GeneratePaypalPaymentUsecase {

    export type Input = {
        amount: number  
        paymentManagementId: string
    }

    export type Output = {
        [ key: string ]: any
    }
}