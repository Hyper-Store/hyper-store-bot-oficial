import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { colors } from "@/modules/@shared/utils/colors";
import { emojis } from "@/modules/@shared/utils/emojis";
import { ProductStockRepository } from "@/modules/product/repositories/product-stock.repository";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class AtddProductCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "teste",
            description: "Adicionar um novo produto a venda",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        await ProductStockRepository.delete('3ada358b-74a7-4365-89fe-48b59215c826', '37eb8a4b-fb9c-45cd-a0f5-8592797f87b1')
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new AtddProductCommand()
    commandContainer.addCommand(command)
}