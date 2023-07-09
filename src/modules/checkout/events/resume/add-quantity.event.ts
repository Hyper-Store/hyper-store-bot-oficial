import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { Database } from "@/infra/app/setup-database";
import { ResumeMessage } from "./@shared/_messages/Resume.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";

class AddQuantityCheckoutEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== 'add-quantity') return;

        const checkout = await CheckoutRepository.findById(interaction.channelId);
        const product = await ProductRepository.findById(checkout?.productId!);

        if (interaction.user.id !== checkout?.ownerId) return;

        if (checkout?.quantity ?? 0 >= (product?.stock ?? []).length) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} Você não pode adicionar mais estoque do que o disponível no produto!`)
                        .setFooter({ text: `Este produto tem 📦 ${product?.stock?.length} estoque disponível!` })
                ],
                ephemeral: true
            })

            return;
        }

        CheckoutRepository.update({ ...checkout, quantity: checkout?.quantity! + 1 })

        interaction.update({ ...await ResumeMessage(interaction) })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AddQuantityCheckoutEvent()
    buttonClickedEvent.setupConsumer(client)
}