import { colors } from '@/modules/@shared/utils/colors';
import Discord, { Client, Interaction } from 'discord.js';
import { emojis } from '../../utils/emojis';

type Props = {
    interaction: Interaction,
    client: Client,
    permission: string
}

const NotHavePermissionMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} Infelizmente você não tem a permissão de \`${props.permission}\` para usar este comando!`)
    ]
})

export { NotHavePermissionMessage }