import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { MessagePing } from "../../@shared/ping/message";
import { ServerBannerMessage } from "./messages/server-banner.message";

class ServerBannerCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "serverbanner",
            description: "Fazer download do banner do servidor",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        interaction.reply({ ...ServerBannerMessage({ interaction, client }) })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new ServerBannerCommand()
    commandContainer.addCommand(command)
}