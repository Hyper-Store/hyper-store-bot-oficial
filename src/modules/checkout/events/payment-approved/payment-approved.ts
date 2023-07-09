import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { ApproveCartUsecase } from "./approve-cart";

class StartCheckoutPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        const rabbitmq = await RabbitmqSingletonService.getInstance()

        const queueName = "approveCheckoutQueue"
        rabbitmq.assertQueue(queueName, { durable: true })
        rabbitmq.bindQueue(queueName, "paymentManagement", "paymentManagement.approved")
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            channel.ack(message)
            await ApproveCartUsecase.execute(client, msg.checkoutId);
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}