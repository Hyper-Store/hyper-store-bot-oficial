import Discord, { Interaction } from "discord.js"
import { PackModel } from "../../models/Pack.model"
import { colors } from "@/modules/@shared/utils/colors"
import { PackOptionModel } from "../../models/PackOption.model"
import { emojis } from "@/modules/@shared/utils/emojis"
import { Footer } from "@/modules/@shared/utils/footer"

type Props = {
    interaction: Interaction,
    pack: PackModel
}
export const PackPanelMessage = async (props: Props): Promise<Discord.MessageCreateOptions> => {

    const options: Discord.SelectMenuComponentOptionData[] = [];

    const role = props.interaction.guild?.roles.cache.get(props.pack.role);

    for (const packOptionId in props.pack.options) {
        const packOption = props.pack.options[packOptionId];

        options.push({
            label: packOption.title,
            emoji: packOption.emoji,
            value: packOption.id!,
            description: `💚 Status: Ativo | 🟢 Disponivel para: ${role?.name}`
        })
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(props.pack.title)
        .setDescription(`> ${props.pack.description}`)
        .addFields(
            {
                name: `🟢 Cargo para resgatar`,
                value: `> \`${role?.name}\``
            }
        )
        .setFooter(Footer({ guild: props.interaction.guild! }))

    if (props.pack.image) embed.setImage(props.pack.image);

    return {
        embeds: [embed],
        components: [
            new Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`pack-download_${props.pack.id}`)
                        .setPlaceholder(`🟢 Escolha uma opção do pack`)
                        .setOptions(options)
                )
        ]
    }
}