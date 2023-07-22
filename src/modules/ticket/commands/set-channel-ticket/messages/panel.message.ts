import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { TicketTypeModel } from '@/modules/ticket/models/TicketType.model';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client,
    banner: string
    ticketType: TicketTypeModel[],
}

const PanelTicketMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setAuthor({ name: props.interaction.guild?.name!, iconURL: props.interaction.guild?.iconURL()! })
            .addFields(
                {
                    name: `${emojis.info} | Informações`,
                    value: "Se você estiver precisando de ajuda selecione uma opção abaixo"
                },
                {
                    name: `${emojis.annoucement} | Horário de atendimento:`,
                    value: "Segunda a Sabado (14:00 até as 23:00 Horas)"
                }
            )
            .setImage(props.banner)
    ],
    components: [
        new Discord.ActionRowBuilder<any>()
            .addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId("open_ticket")
                    .setPlaceholder('➡️ Escolha uma opção de ticket')
                    .addOptions(
                        props.ticketType.map(type => {
                            return {
                                emoji: type.emoji_custom,
                                label: type.title,
                                description: type.description,
                                value: type.id
                            }
                        })
                    )
            )
    ]
})

export { PanelTicketMessage }