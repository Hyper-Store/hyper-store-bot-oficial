import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class AddProductCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "addproduct",
            description: "Adicionar um novo produto a venda",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        interaction.reply({
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

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new AddProductCommand()
    commandContainer.addCommand(command)
}