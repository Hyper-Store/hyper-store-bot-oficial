import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { TypeTicket } from "../../@shared/type-tickets/type-tickets";
import { DatabaseConfig } from "@/infra/app/setup-config";

class SetChannelTicketCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setchannelticket",
            description: "Setar este canal como o canal para abertura de ticket's",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "category",
                    description: "Categoria de onde vai ser aberto o ticket",
                    type: 7,
                    required: true
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
            return;
        }

        const category_channel = interaction.options.getChannel("category");

        if (category_channel?.type !== Discord.ChannelType.GuildCategory) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} A categoria informada não é do tipo \`Categoria\`, verifique e tente novamente!`)
                ]
            })
            return;
        }

        await new DatabaseConfig().set("ticket.category_id", category_channel.id)

        await interaction.channel?.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setAuthor({ name: interaction.guild?.name!, iconURL: interaction.guild?.iconURL()! })
                    .addFields(
                        {
                            name: `${emojis.info} | Informações`,
                            value: "Se você estiver precisando de ajuda selecione uma opção abaixo"
                        },
                        {
                            name: `${emojis.annoucement} | Horário de atendimento:`,
                            value: "Segunda a Sabado (14:00 até as 23:00 Horas)"
                        }
                    )
                    .setImage(await new DatabaseConfig().get("ticket.banner") as string)
            ],
            components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId("open_ticket")
                            .setPlaceholder('➡️ Escolha uma opção de ticket')
                            .addOptions(
                                TypeTicket.map(type => {
                                    return {
                                        emoji: type.emoji_custom,
                                        label: type.title,
                                        description: type.description,
                                        value: type.id
                                    }
                                })
                            )
                    )
            ]
        })

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} O canal ${interaction.channel} foi setado com sucesso!`)
            ],
            ephemeral: true
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetChannelTicketCommand()
    commandContainer.addCommand(command)
}