import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";

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

        if (interaction.user.id !== checkout?.ownerId) return;
        if (checkout.status !== "APPROVED") return;

        await CheckoutRepository.update({ ...checkout, review: parseInt(interaction.customId.split('_')[1]) })

        interaction.update({
            embeds: [
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