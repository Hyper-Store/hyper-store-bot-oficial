import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { Footer } from "@/modules/@shared/utils/footer"
import { PackModel } from "@/modules/pack/models/Pack.model"
import { PackOptionModel } from "@/modules/pack/models/PackOption.model"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    pack: PackModel,
    option: PackOptionModel
}

export const PackDownloadMessage = (props: Props): Discord.MessageCreateOptions => {

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(`${props.pack.title} | ${props.option.title}`)
        .setDescription(`\`\`\`${props.option.content}\`\`\``)
        .setFooter(Footer({ guild: props.interaction.guild! }))

    const buttons = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel('Fazer download')
                .setEmoji(emojis.download)
                .setURL(props.option.url!)
                .setStyle(5)
        );

    if (props.pack.image) embed.setImage(props.pack.image)

    if (props.option.youtubeURL) buttons.addComponents(
        new Discord.ButtonBuilder()
            .setLabel('Vídeo tutorial')
            .setEmoji(emojis.youtube)
            .setURL(props.option.url!)
            .setStyle(5)
    )

    return {
        embeds: [embed],
        components: [buttons]
    }
}