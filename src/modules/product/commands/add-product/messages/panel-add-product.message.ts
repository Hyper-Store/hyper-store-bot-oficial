import { colors } from '@/modules/@shared/utils/colors';
import { emojis } from '@/modules/@shared/utils/emojis';
import Discord, { Client, Interaction, InteractionReplyOptions } from 'discord.js';

type Props = {
    interaction: Interaction,
    client: Client
}

const PanelAddProductMessage = (props: Props): InteractionReplyOptions => ({
    content: `||${props.interaction.user}||`,
    embeds: [
        new Discord.EmbedBuilder()
            .setColor(colors.invisible!)
            .setDescription(`> ${emojis.success} Para adicionar um novo produto clique ao botão abaixo para continuar!`)
    ],
    components: [
        new Discord.ActionRowBuilder<any>()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('add_product')
                    .setLabel('Adicionar produto')
                    .setEmoji('➕')
                    .setStyle(2)
            )
    ],
    ephemeral: true
})

export { PanelAddProductMessage }