import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CancelPaymentProviderUsecase } from "../usecases"

const cancelPaymentProviderConsumer = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    const queueName = "cancelPaymentProviderQueue"
    rabbitmq.assertQueue(queueName, { durable: true })
    rabbitmq.bindQueue(queueName, "checkout", "checkout.failed_reserve_stock")
    rabbitmq.consume(queueName, async (message, channel) => {

        const msg = JSON.parse(message.content.toString())

        await CancelPaymentProviderUsecase.execute({
            checkoutId: msg.checkoutId
        })
    })
}

cancelPaymentProviderConsumer()

