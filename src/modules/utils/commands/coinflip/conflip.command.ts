import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { colors } from "@/modules/@shared/utils/colors";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"

class CoinflipCommand extends BaseSlashCommand {

    constructor() {
        super({
            name: "conflip",
            description: "Jogo de cara ou coroa, você contra eu",
            type: Discord.ApplicationCommandType.ChatInput,
            options: [
                {
                    name: "choice",
                    description: "Escolha se quer cara ou coroa",
                    type: Discord.ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: "Cara",
                            value: "heads"
                        },
                        {
                            name: "Coroa",
                            value: "tails"
                        }
                    ]
                }
            ]
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(colors.invisible!)
                    .setTitle('Pong 🏓')
                    .setDescription([
                        `> 🛅 Meu ping atual é de: \`${client.ws.ping}MS\``,
                        `> 🛰️ Shards: \`20\``,
                        `> 📦 Container: \`Online\``
                    ].join("\n"))
                    .setFooter({ text: "Comando consultado hoje às", iconURL: interaction.guild?.iconURL()! })
                    .setTimestamp()
            ]
        })
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new CoinflipCommand()
    commandContainer.addCommand(command)
}