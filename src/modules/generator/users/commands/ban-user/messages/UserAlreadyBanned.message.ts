import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';
import { UserModel } from '../../../models/User.model';

type Props = {
    interaction: Interaction,
    client: Client,
    user: UserModel
}

const UserAlreadyBannedMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} Usuário \`${props.user.username}\` já está banido da plataforma!`)
    ],
    ephemeral: true
})

export { UserAlreadyBannedMessage }