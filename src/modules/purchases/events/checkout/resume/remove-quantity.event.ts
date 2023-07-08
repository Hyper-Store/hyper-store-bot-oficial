import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction, Message } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ProductType } from "@/modules/purchases/@types/Product.type";
import { CheckoutType } from "../@shared/_types/Checkout.type";
import { ResumeMessage } from "./@shared/_messages/Resume.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";

class RemoveQuantityCheckoutPurchasesPurchasesEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'remove-quantity') return;

        const checkout = await new Database().get(`purchases.checkouts.${interaction.channelId}`) as CheckoutType;
        const product: ProductType | undefined = await new Database().get(`purchases.products.${checkout.productId}`) as ProductType;

        if (interaction.user.id !== checkout.ownerId) return;

        if (checkout.quantity <= 1) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} Você não pode comprar menos que 1 item deste produto!`)
                ],
                ephemeral: true
            })

            return;
        }

        await new Database().set(`purchases.checkouts.${interaction.channelId}.quantity`, checkout.quantity - 1)

        interaction.update({ ...await ResumeMessage(interaction) })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new RemoveQuantityCheckoutPurchasesPurchasesEvent()
    buttonClickedEvent.setupConsumer(client)
}