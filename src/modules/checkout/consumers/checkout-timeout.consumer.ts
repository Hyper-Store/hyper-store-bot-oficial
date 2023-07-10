import { RabbitmqSingletonService } from "@/modules/@shared/services"
import { CheckCheckoutTimeoutUsecase } from "../usecases/check-checkout-timeout"

const reserveStockConsumer = async () => {

    const rabbitmq = await RabbitmqSingletonService.getInstance()
    const queueName = "CheckoutTimeoutHandlerQueue"
    rabbitmq.assertQueue(queueName, { durable: true, })
    rabbitmq.bindQueue(queueName, "checkoutTimeout", "")
    rabbitmq.consume(queueName, async (message, channel) => {
        const msg = JSON.parse(message.content.toString())
        await CheckCheckoutTimeoutUsecase.execute({ checkoutId: msg.checkoutId })
    })
}

reserveStockConsumer()

