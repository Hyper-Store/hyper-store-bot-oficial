import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CancelCheckoutUseCase } from "./cancel-checkout";

class CloseChannelCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "ready"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        const rabbitmq = await RabbitmqSingletonService.getInstance()
        const queueName = "checkoutCancelByInativityQueue"
        rabbitmq.assertQueue(queueName, { durable: true, })
        rabbitmq.bindQueue(queueName, 'checkout', 'checkout.checkout_timeout_reached')
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            return await CancelCheckoutUseCase.execute(client, { ...msg })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CloseChannelCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}