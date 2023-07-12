import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import { PackModel } from "@/modules/pack/models/Pack.model"
import { PackOptionModel } from "@/modules/pack/models/PackOption.model"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction,
    option: PackOptionModel,
    pack: PackModel
}

export const OptionPackCreatedSuccessMessage = (props: Props): Discord.InteractionUpdateOptions => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.success} A opção \`${props.option.title}\` foi criada com sucesso e vinculada ao pack \`${props.pack.title}\`!`)
        ],
        components: []
    }
}