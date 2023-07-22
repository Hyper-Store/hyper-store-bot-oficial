import { DatabaseConfig } from '@/infra/app/setup-config';
import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import { Footer } from '@/modules/@shared/utils/footer';
import { KeyModel } from '@/modules/redeemkey/models/Key.model';
import Discord, { Client, Interaction } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const PanelKeyMessage = (props: Props) => ({
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setTitle("Como resgatar key?")
            .setDescription(`> 🔑 Para resgatar uma key, clique no botão abaixo.`)
            .setImage(new DatabaseConfig().get('reedemkey.banner') as string)
            .setFooter({ ...Footer({ guild: props.interaction.guild! }) })
    ],
    components: [
        new Discord.ActionRowBuilder<any>()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('reedem_key')
                    .setLabel('Resgatar key')
                    .setEmoji('🎁')
                    .setStyle(2)
            )
    ]
})

export { PanelKeyMessage }