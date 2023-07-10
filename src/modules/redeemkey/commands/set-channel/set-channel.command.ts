import { DatabaseConfig } from "@/infra/app/setup-config";
import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class SetChannelReedemKeyCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setchannelreedemkey",
            description: "Setar o canal atual para os usuários resgatarem as keys",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {

        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrador" }) })
            return;
        }

        await interaction.channel?.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setTitle("Como resgatar key?")
                    .setDescription(`> 🔑 Para resgatar uma key, clique no botão abaixo.`)
                    .setImage(new DatabaseConfig().get('reedemkey.banner') as string)
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

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setDescription(`> ${emojis.success} Canal setado com sucesso para resgatar key!`)
            ],
            ephemeral: true
        })

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetChannelReedemKeyCommand()
    commandContainer.addCommand(command)
}