import { DatabaseConfig } from "@/infra/app/setup-config";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import Discord, { Interaction } from "discord.js";

export const NoStockProduct = async (interaction: Interaction): Promise<Discord.InteractionReplyOptions> => {
    if (Array.isArray(interaction.member?.roles)) return {};
    const role_id: string = await new DatabaseConfig().get('reedemkey.role_notification_stock') as string;

    if (interaction.member?.roles.cache.get(role_id)) {
        return {
            content: `${interaction.user}`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.warning} Este produto está sem estoque no momento, você está com o sistema de notificação ativa, e assim que reabastecido você será notificado!`)
            ],
            ephemeral: true
        }
    }

    return {
        content: `${interaction.user}`,
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(colors.invisible!)
                .setDescription(`> ${emojis.warning} Este produto está sem estoque no momento, ative as notificações para quando for reabastecido você ser notificado!`)
        ],
        components: [
            new Discord.ActionRowBuilder<any>()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('allow-notify-purchases')
                        .setLabel('Ativar notificações')
                        .setEmoji(emojis.notifiy)
                        .setStyle(2)

                )
        ],
        ephemeral: true
    }
}