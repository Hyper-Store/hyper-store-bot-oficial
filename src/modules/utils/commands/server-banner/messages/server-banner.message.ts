import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { Footer } from "@/modules/@shared/utils/footer"
import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"

type Props = {
    interaction: Interaction,
    client: Client
}

export const ServerBannerMessage = (props: Props): InteractionReplyOptions => {

    const banner = props.interaction.guild?.iconURL({ size: 4096, extension: 'png' }) as string

    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setAuthor({ name: `${props.interaction.guild?.name}`, iconURL: banner })
                .setTitle(`${props.interaction.guild?.name}`)
                .setImage(banner)
                .setFooter({ ...Footer({ guild: props.interaction.guild! }) })
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Fazer download')
                        .setEmoji(emojis.download)
                        .setStyle(5)
                        .setURL(banner)
                )
        ]
    }
}