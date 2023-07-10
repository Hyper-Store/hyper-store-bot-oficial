import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CheckoutProductMessageChannel } from "./messages/CheckoutProductMessageChannel";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

class ReviewCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('review')) return;

        const checkout = await CheckoutRepository.findById(interaction.channelId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (interaction.user.id !== checkout?.ownerId) return;
        if (checkout.status !== "APPROVED") return;

        await CheckoutRepository.update({ ...checkout, review: parseInt(interaction.customId.split('_')[1]) })

        interaction.update({
            embeds: [
                (await CheckoutProductMessageChannel({ client, checkout, product: product!, user: owner! })).embeds[0],
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Sua avaliação foi enviada com sucesso, muito obrigado(a)!`)
            ],
            components: []
        })

        return;
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ReviewCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}