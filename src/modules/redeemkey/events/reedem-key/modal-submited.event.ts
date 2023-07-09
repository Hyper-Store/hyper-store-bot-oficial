import { Database } from "@/infra/app/setup-database";
import { BaseEvent } from "@/modules/@shared/domain";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { CacheType, Interaction, ClientEvents } from "discord.js";
import Discord, { Client } from "discord.js"
import { DisableKey } from "../../@shared/disable-key/disable-key";


class ModalSubmitedReedemKeyEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "reedem_key") return;

        const key = interaction.fields.getTextInputValue("key");

        const key_db: any = await new Database().get(`reedemkey.${key}`);
        if (!key_db) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} A key \`${key}\` pode estar inválida, ou não existe mais!`)
                ],
                ephemeral: true
            })

            return;
        }

        if (!key_db.status) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} A key \`${key}\` já foi resgatada por outro usuário!`)
                ],
                ephemeral: true
            })

            return;
        }

        switch (key_db.type) {
            case "role":
                try {
                    if (Array.isArray(interaction.member?.roles)) return;
                    interaction.member?.roles.add(key_db.content);
                } catch (error) {
                    interaction.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(colors.error!)
                                .setDescription(`> ${emojis.error} Infelizmente não foi possível te entregar o cargo, houve um erro!\nEntre em contato com a administração para mais informações.`)
                        ],
                        ephemeral: true
                    })

                    return;
                }

                await DisableKey(key, interaction.user.id);

                interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(colors.invisible!)
                            .setDescription(`> ${emojis.success} Você resgatou a key com sucesso, e recebeu o cargo: \`${interaction.guild?.roles.cache.get(key_db.content)?.name}\`!`)
                    ],
                    ephemeral: true
                })

                break;

            case "message":
                await interaction.user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(colors.invisible!)
                            .setDescription(`> 🔑 Aqui está o conteúdo do produto resgatado pela key:\n\`\`\`${key_db.content}\`\`\``)
                    ]
                })

                await DisableKey(key, interaction.user.id);

                interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(colors.invisible!)
                            .setDescription(`> ${emojis.success} Você resgatou a key com sucesso, e foi enviado o conteúdo em seu privado!`)
                    ],
                    ephemeral: true
                })

                break
            default:
                interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(colors.error!)
                            .setDescription(`> ${emojis.error} Não foi possível encontrar o tipo de conteúdo a ser entregue, entre em contato com a administração para mais informações!!`)
                    ],
                    ephemeral: true
                })

                break;
        }
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedReedemKeyEvent()
    buttonClickedEvent.setupConsumer(client)
}