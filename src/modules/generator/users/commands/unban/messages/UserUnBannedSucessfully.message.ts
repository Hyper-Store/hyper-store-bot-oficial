import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';
import { UserModel } from '../../../models/User.model';

type Props = {
    interaction: Interaction,
    client: Client,
    user: UserModel
}

const UserUnBannedSucessfullyMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Usuário \`${props.user.username}\` desbanido com sucesso do gerador!`)
    ],
    ephemeral: true
})

export { UserUnBannedSucessfullyMessage }