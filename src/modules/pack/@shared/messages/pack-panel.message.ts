import Discord, { Interaction } from "discord.js"
import { PackModel } from "../../models/Pack.model"
import { colors } from "@/modules/@shared/utils/colors"
import { PackOptionModel } from "../../models/PackOption.model"
import { emojis } from "@/modules/@shared/utils/emojis"
import { Footer } from "@/modules/@shared/utils/footer"
import { PackRepository } from "../../repositories/Pack.repository"
import { PackNotExistErrorMessage } from "./pack-not-exist-error.message"

export type PackPanelMessageProps = {
    interaction: Interaction,
    packId: string
}
export const PackPanelMessage = async (props: PackPanelMessageProps): Promise<any> => {

    const pack = await PackRepository.findById(props.packId);
    if (!pack) return PackNotExistErrorMessage({ ...props });

    const options: Discord.SelectMenuComponentOptionData[] = [];

    const role = props.interaction.guild?.roles.cache.get(pack.role);

    for (const packOptionId in pack.options) {
        const packOption = pack.options[packOptionId];

        options.push({
            label: packOption.title,
            emoji: packOption.emoji,
            value: packOption.id!,
            description: `💚 Status: Ativo | 🟢 Disponivel para: ${role?.name}`
        })
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.invisible!)
        .setTitle(pack.title)
        .setDescription(`> ${emojis.info} ${pack.description}`)
        .addFields(
            {
                name: `🟢 Cargo para resgatar`,
                value: `> ${role}`
            }
        )
        .setFooter(Footer({ guild: props.interaction.guild! }))

    if (pack.image) embed.setImage(pack.image);

    return {
        embeds: [embed],
        components: [
            new Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(`pack-download_${pack.id}`)
                        .setPlaceholder(`🟢 Escolha uma opção do pack`)
                        .setOptions(options)
                )
        ]
    }
}