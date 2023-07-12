import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { PackRepository } from "@/modules/pack/repositories/Pack.repository";
import Discord, { Interaction } from "discord.js";

type Props = {
    interaction: Interaction,
    description?: string,
    customId: string
}

export const SelectPackMessage = async (props: Props): Promise<Discord.InteractionReplyOptions> => {

    const packList = await PackRepository.getAll();

    const options: Discord.SelectMenuComponentOptionData[] = []

    for (const packId in packList) {
        const pack = packList[packId];

        options.push({
            label: pack.title,
            emoji: '📦',
            value: pack.id!,
            description: `Criado há ${new Date(pack.createdAt!).toLocaleDateString('pt-BR')}`
        })
    }

    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setAuthor({ name: props.interaction.guild?.name!, iconURL: props.interaction.guild?.iconURL()! })
                .setDescription(props.description!)
        ],
        components: [
            new Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>()
                .addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId(props.customId)
                        .setPlaceholder('🟢 Escolha um pack para continuar')
                        .setOptions(options)
                )
        ],
        ephemeral: true
    }
}