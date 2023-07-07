import { DatabaseConfig } from "@/infra/app/setup-config";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { Message, } from "discord.js";
import Discord, { Client } from "discord.js"


class ButtonClickedEvent extends BaseEvent {
    constructor() {
        super({
            event: "messageCreate"
        })
    }

    async exec(interaction: Message): Promise<void> {
        if (interaction.channelId !== await new DatabaseConfig().get('feedback.channel_id')) return;
        if (/(ruim|orrivel|péssimo|terrível|lixo|merda|mérda|scammer|scam)/i.test(interaction.content)) {
            interaction.delete();
            interaction.author.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.invisible!)
                        .setDescription(`> ${emojis.notifiy} Sentimos muito por não ter sido conveniente e em solucionar seu problema, abra um ticket e conte um pouco mais sobre o ocorrido para que possamos te ajudar, Se possível avalie novamente!\n\nConteúdo enviado: \`\`\`${interaction.content}\`\`\``)
                ]
            })

            return;
        }

        interaction.react(new DatabaseConfig().get('feedback.emoji_auto_react') as string)
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ButtonClickedEvent()
    buttonClickedEvent.setupConsumer(client)
}