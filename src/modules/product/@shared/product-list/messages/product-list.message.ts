import { colors } from "@/modules/@shared/utils/colors"
import Discord, { Interaction, Client } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client,
    description: string
    customId: string,
    page: number,
    list_product: Discord.SelectMenuComponentOptionData[][]
}

export const ProductListMessage = (props: Props) => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(props.description)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`${props.customId}`)
                        .setPlaceholder('⏩ Escolha uma opção')
                        .setOptions(props.list_product[props.page])
                ),
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`back-page-${props.page}`)
                        .setLabel('Voltar')
                        .setEmoji('↩')
                        .setDisabled(props.page <= 0)
                        .setStyle(1)
                )
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`next-page-${props.page}`)
                        .setLabel('Próximo')
                        .setEmoji('↪')
                        .setDisabled((props.page + 1) === props.list_product.length)
                        .setStyle(1)
                )
        ],
        ephemeral: true
    }
}