import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction, Message } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ProductType } from "@/modules/purchases/@types/Product.type";
import { CheckoutType } from "../@shared/_types/Checkout.type";
import { ResumeMessage } from "./@shared/_messages/Resume.message";

class StartCheckoutPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'accept-cart') return;

        const checkout = await new Database().get(`purchases.checkouts.${interaction.channelId}`) as CheckoutType;
        const product: ProductType | undefined = await new Database().get(`purchases.products.${checkout.productId}`) as ProductType;

        if (interaction.user.id !== checkout.ownerId) return;

        interaction.update({ ...await ResumeMessage(interaction) })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new StartCheckoutPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}