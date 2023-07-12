import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { PackModel } from "@/modules/pack/models/Pack.model"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    pack: PackModel
}

export const PackDeleteSuccessfully = async (props: Props): Promise<Discord.InteractionUpdateOptions> => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} Pack \`${props.pack.title}\` deletado com sucesso!`)
        ]
    }
}