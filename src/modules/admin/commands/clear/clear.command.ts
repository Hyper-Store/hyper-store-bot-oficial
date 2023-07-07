import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class ClearCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "clear",
            description: "Deletar mensagens de um canal específico",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "quantity",
                    description: "Escolha a quantidade de mensagens que deseja pagar [1-99]",
                    type: 10,
                    min_value: 1,
                    max_value: 99,
                    required: true
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.appPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
        }

        const quantity = interaction.options.getNumber("quantity");

        console.log(quantity)
        try {
            if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;
            await interaction.channel.bulkDelete(quantity!)
        } catch (error) {
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(colors.error!)
                        .setDescription(`> ${emojis.error} Infelizmente eu não tenho permissão para deletar mensagens de 2 semanas atrás!`)
                ]
            })

            return;
        }


        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} O canal ${interaction.channel} teve \`${quantity}\` mensagens apagadas por ${interaction.user}`)
            ]
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new ClearCommand()
    commandContainer.addCommand(command)
}