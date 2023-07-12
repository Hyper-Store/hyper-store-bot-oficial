import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CancelCheckoutMessage } from "./messages/cancel-checkout.message";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CancelCheckoutUsecase } from "../../usecases";
import { CloseChannelCheckoutRabbitMq } from "../../@shared/rabbitmq/close-channel-checkout.rabbitmq";

class CancelChannelCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })

    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "cancel-checkout") return;

        const checkout = await CheckoutRepository.findById(interaction.channelId);
        const product = await ProductRepository.findById(checkout?.productId!);

        if (interaction.user.id !== checkout?.ownerId) return;

        CancelCheckoutUsecase.execute({ checkoutId: checkout.id, emmitEvent: false })
        CloseChannelCheckoutRabbitMq.execute({ checkoutId: checkout.id })

        interaction.user.send({
            ...await CancelCheckoutMessage({
                interaction,
                checkout: checkout!,
                product: product!
            })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CancelChannelCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}