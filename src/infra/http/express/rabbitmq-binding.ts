import { RabbitmqSingletonService } from "@/modules/@shared/services"


export const bindingRabbitmq = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    rabbitmq.assertExchange("mercadopagoPayment", "direct")
    rabbitmq.assertExchange("paymentManagement", "direct")
    rabbitmq.assertExchange("checkout", "direct")

    rabbitmq.assertExchange("checkoutTimeout", "fanout")
    rabbitmq.assertQueue("checkoutTimeoutQueue", { 
        durable: true,
        arguments: {
            'x-message-ttl': parseInt(process.env.CHECKOUT_TIMEOUT_IN_MS!), // delay in ms
            'x-dead-letter-exchange': "checkoutTimeout" // when message expires, send to this exchange
        } 
    })

}