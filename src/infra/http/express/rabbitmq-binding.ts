import { RabbitmqSingletonService } from "@/modules/@shared/services"


export const bindingRabbitmq = async () => {
    const rabbitmq = await RabbitmqSingletonService.getInstance()

    rabbitmq.assertExchange("mercadopagoPayment", "direct")
    rabbitmq.assertExchange("paymentManagement", "direct")
    rabbitmq.assertExchange("checkout", "direct")
}