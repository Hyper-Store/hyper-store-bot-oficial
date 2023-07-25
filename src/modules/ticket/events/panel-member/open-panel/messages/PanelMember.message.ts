import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const PanelMemberMessage = (props: Props): InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Seja bem-vindo ao painel membro do nosso sistema de ticket, escolha uma opção abaixo para continuar`)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('panel-member-options')
                        .setPlaceholder('➡️ Escolha uma opção para continuar')
                        .addOptions(
                            {
                                emoji: emojis.save,
                                label: 'Salvar logs',
                                description: 'Fazer backup de todas as conversas',
                                value: 'save-logs',
                            }
                        )
                )
        ],
        ephemeral: true
    }
}