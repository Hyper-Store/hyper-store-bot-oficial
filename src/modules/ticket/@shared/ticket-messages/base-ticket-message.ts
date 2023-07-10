import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import Discord, { Client, Interaction } from 'discord.js'
import { TypeTicket } from "../type-tickets/type-tickets";

type Props = {
    interaction: Interaction,
    client: Client,
    type: string,
    reason: string,
    createdAt: Date,
    field?: Discord.APIEmbedField
}

export const Embed = (props: Props) => {

    const typeTicket = TypeTicket.find(type => type.id === props.type)

    const embed = new Discord.EmbedBuilder()
        .setColor(colors.error!)
        .setDescription(`> ${emojis.notifiy} Aguarde atenciosamente a equipe atende-lo, você também pode interagir com os botões abaixo caso precise de algo.`)
        .addFields(
            {
                name: `${emojis.bug} Motivo do ticket:`,
                value: `\`\`\`${props.reason}\`\`\``
            },
            {
                name: `${emojis.bug} Tipo de ticket:`,
                value: `\`\`\`${typeTicket?.emoji} ${typeTicket?.title}\`\`\``
            },
            {
                name: `${emojis.time} Criado há`,
                value: `<t:${Math.floor(props.createdAt.getTime() / 1000)}:f> \`(\`<t:${Math.floor(props.createdAt.getTime() / 1000)}:R>\`)\``
            },
        )

    if (props.field) {
        embed.addFields(props.field)
    }

    return embed
}