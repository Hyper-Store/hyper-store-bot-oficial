import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
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
        const queueName = "deliveryStockQueue"
        rabbitmq.assertQueue(queueName, { durable: true, })
        rabbitmq.bindQueue(queueName, "checkout", "checkout.stock_reserved")
        rabbitmq.consume(queueName, async (message, channel) => {
            const msg = JSON.parse(message.content.toString())
            return await ApproveCartUsecase.execute(client, { ...msg })
        })

    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}