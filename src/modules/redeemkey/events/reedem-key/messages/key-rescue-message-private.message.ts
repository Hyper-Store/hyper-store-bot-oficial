import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { KeyModel } from '@/modules/redeemkey/models/Key.model';
import Discord, { Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    key: KeyModel
}

export const KeyRescueMessageSuccessPrivateMessage = (props: Props) => {
    return {
        content: `${props.interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> 🔑 Aqui está o conteúdo do produto resgatado pela key:\n\`\`\`${props.key.content}\`\`\``)
        ]
    }
}