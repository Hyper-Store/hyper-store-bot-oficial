import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { colors } from "@/modules/@shared/utils/colors";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { MessagePing } from "../../@shared/ping/message";

class PingCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "ping",
            description: "Veja o meu ping em tempo real",
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        interaction.reply({ ...MessagePing(interaction, client) })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new PingCommand()
    commandContainer.addCommand(command)
}