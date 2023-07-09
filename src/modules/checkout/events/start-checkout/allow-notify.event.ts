import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import Discord, { Client } from "discord.js"
import { DatabaseConfig } from "@/infra/app/setup-config";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";


class AllowNotifyEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "allow-notify-purchases") return;

        if (Array.isArray(interaction.member?.roles)) return;
        const role_id: string = await new DatabaseConfig().get('reedemkey.role_notification_stock') as string;

        if (interaction.member?.roles.cache.get(role_id)) {
            interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} Você já está com as notificações ativa e irá receber notificação após o reabastecimento!`)
                ],
                components: []
            })

            return;
        }

        await interaction.member?.roles.add(role_id);
        interaction.update({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} A notificação foi ativa com sucesso, e você receberá uma notificação após o reabastecimento de estoque!`)
            ],
            components: []
        })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new AllowNotifyEvent()
    buttonClickedEvent.setupConsumer(client)
}