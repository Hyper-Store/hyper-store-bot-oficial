import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction } from 'discord.js';
import { Channel } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const ChannelSetedSuccessfullyMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} O canal ${props.interaction.channel} foi setado com sucesso!`)
    ],
    ephemeral: true
})

export { ChannelSetedSuccessfullyMessage }