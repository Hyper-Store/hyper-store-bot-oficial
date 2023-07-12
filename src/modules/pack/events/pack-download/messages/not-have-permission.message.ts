import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction, Role } from "discord.js"

type Props = {
    interaction: Interaction,
    role: Role
}

export const NotHavePermissionMessage = async (props: Props): Promise<Discord.InteractionReplyOptions> => {
    return {
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.error} Você não tem permissão de utilizar este pack, você precisa do cargo de \`${props.role.name}\``)
        ],
        ephemeral: true
    }
}