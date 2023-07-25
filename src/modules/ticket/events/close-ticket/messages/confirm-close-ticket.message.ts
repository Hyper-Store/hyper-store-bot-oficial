import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const ConfirmCloseTicketMessage = (props: Props): InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Você realmente deseja fechar seu ticket?`)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('confirm-close-ticket')
                        .setLabel('Fechar ticket')
                        .setEmoji(emojis.confirm)
                        .setStyle(4)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('cancel-close-ticket')
                        .setLabel('Cancelar')
                        .setEmoji(emojis.cancel)
                        .setStyle(1)
                )
        ],
        ephemeral: true
    }
}