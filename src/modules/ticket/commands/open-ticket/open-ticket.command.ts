import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { ChatInputCommandInteraction } from "discord.js";
import Discord from "discord.js"

class OpenTicketCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "openticket",
            description: "Open a ticket",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "reason",
                    description: "reason to open a ticket",
                    type: 6
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction): Promise<void> {
        interaction.reply({
            content: "aq", components: [
                new Discord.ActionRowBuilder<any>()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('teste')
                            .setLabel("Clicar")
                            .setStyle(2)
                    )
            ]
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new OpenTicketCommand()
    commandContainer.addCommand(command)
}