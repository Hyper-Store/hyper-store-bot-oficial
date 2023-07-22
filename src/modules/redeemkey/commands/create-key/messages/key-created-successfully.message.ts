import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { KeyModel } from '@/modules/redeemkey/models/Key.model';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const KeyCreatedSuccessfullyMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Parabens, sua key foi gerada com sucesso e já foi enviada em seu privado!`)
    ],
    ephemeral: true
})

export { KeyCreatedSuccessfullyMessage }