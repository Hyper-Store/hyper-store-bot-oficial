import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { ProductList } from "../../@shared/product-list/product-list";

class SetProductPurchasesCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "setproduct",
            description: "Setar algum produto a este canal",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        interaction.reply({
            ...await ProductList({
                client,
                interaction,
                customId: 'set-product',
                description: `> ${emojis.notifiy} Escolha um produto abaixo para ser modificado!`
            })
        })

        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new SetProductPurchasesCommand()
    commandContainer.addCommand(command)
}