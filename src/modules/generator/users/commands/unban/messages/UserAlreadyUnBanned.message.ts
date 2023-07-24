import Discord, { Client, Interaction, InteractionReplyOptions } from "discord.js"
import { UserModel } from "../../../models/User.model"
import { emojis } from "@/modules/@shared/utils/emojis"
import { colors } from "@/modules/@shared/utils/colors"

type Props = {
    interaction: Interaction,
    client: Client,
    user: UserModel
}

export const UserAlreadyUnBannedMessage = (props: Props): InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Usuário \`${props.user.username}\` já está desbanido da plataforma!`)
        ],
        ephemeral: true
    }
}