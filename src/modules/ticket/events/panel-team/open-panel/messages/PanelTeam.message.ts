import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const PanelTeamMessage = (props: Props): InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.notifiy} Seja bem-vindo ao painel team do nosso sistema de ticket, escolha uma opção abaixo para continuar`)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('panel-team-options')
                        .setPlaceholder('➡️ Escolha uma opção para continuar')
                        .addOptions(
                            {
                                emoji: emojis.save,
                                label: 'Salvar logs',
                                description: 'Fazer backup de todas as conversas',
                                value: 'save-logs',
                            },
                            {
                                emoji: emojis.notifiy,
                                label: 'Enviar notificação',
                                description: 'Envie uma notificação no privado do usuário',
                                value: 'send-notify',
                            },
                            {
                                emoji: emojis.delete,
                                label: 'Fechar ticket',
                                description: 'Fechar o ticket diretamente',
                                value: 'close-ticket',
                            }
                        )
                )
        ],
        ephemeral: true
    }
}