import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { SetMercadopagoProviderUsecase } from "../usecases"


const setMercadopagoProviderConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "setMercadopagoProviderQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "mercadopagoPayment", "mercadopagoPayment.created")
    rabbitmq.consume(queueName,  async (message, channel) => { 

        const msg = JSON.parse(message.content.toString())

        await SetMercadopagoProviderUsecase.execute({
            paymentManagementId: msg.paymentManagementId
        })
    })
}

setMercadopagoProviderConsumer()

