import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';
import { UserModel } from '../../../models/User.model';

type Props = {
    interaction: Interaction,
    client: Client,
    user: UserModel,
    password: string
}

const ChangeUserPasswordSucessfullyMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} A senha do usuário \`${props.user.username}\` foi trocada com sucesso para \`${props.password}\``)
    ],
    ephemeral: true
})

export { ChangeUserPasswordSucessfullyMessage }