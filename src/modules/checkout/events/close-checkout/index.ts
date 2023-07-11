import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CloseCheckoutMessage } from "./messages/close-checkout.message";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CancelCheckoutUsecase } from "../../usecases";

class CloseChannelCheckoutEvent extends BaseEvent {
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

        CancelCheckoutUsecase.execute({ checkoutId: checkout.id })

        interaction.user.send({
            ...await CloseCheckoutMessage({
                interaction,
                checkout: checkout!,
                product: product!
            })
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new CloseChannelCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}