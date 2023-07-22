import { colors } from '@/modules/@shared/utils/colors';
import Discord, { Client, Interaction } from 'discord.js';
import { emojis } from '../../utils/emojis';

type Props = {
    interaction: Interaction,
    client: Client,
    role: string
}

const RoleNotExistMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.error!)
            .setDescription(`> ${emojis.error} O cargo \`${props.role}\` não existe no servidor!`)
    ]
})

export { RoleNotExistMessage }