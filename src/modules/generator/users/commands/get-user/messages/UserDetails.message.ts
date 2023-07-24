import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';
import { UserModel } from '../../../models/User.model';

type Props = {
    interaction: Interaction,
    client: Client,
    user: UserModel
}

const UserDetailsMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Usuário encontrado com sucesso, veja abaixo as informações...`)
            .addFields(
                {
                    name: `${emojis.support} ID:`,
                    value: `\`${props.user.id}\``
                },
                {
                    name: `${emojis.support} Nome de usuário:`,
                    value: `\`${props.user.username}\``
                },
                {
                    name: `${emojis.email} Email:`,
                    value: `\`${props.user.email}\``
                },
                {
                    name: `${emojis.delete} Está banido`,
                    value: `\`${props.user.isBanned ? "Sim" : "Não"}\``
                }
            )
    ],
    ephemeral: true
})

export { UserDetailsMessage }