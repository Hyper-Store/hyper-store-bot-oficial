import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { PanelAddProductMessage } from "./messages/panel-add-product.message";

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

        interaction.reply({ ...PanelAddProductMessage({ client, interaction }) });

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new AddProductCommand()
    commandContainer.addCommand(command)
}