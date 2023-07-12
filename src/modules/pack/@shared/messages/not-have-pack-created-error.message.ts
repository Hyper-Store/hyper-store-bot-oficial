import { colors } from "@/modules/@shared/utils/colors"
import { emojis } from "@/modules/@shared/utils/emojis"
import Discord, { Interaction } from "discord.js"

type Props = {
    interaction: Interaction
}

export const NotHavePackCreatedErrorMessage = (props: Props): Discord.InteractionReplyOptions => {
    return {
        content: `||${props.interaction.user}||`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.error!)
                .setDescription(`> ${emojis.error} Infelizmente não há nenhum pack criado para ser setado, utilize o comando \`/createpack\` para criar um novo!`)
        ],
        ephemeral: true
    }
}