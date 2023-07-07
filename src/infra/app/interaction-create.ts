import { Client } from "discord.js"
import { commands } from "./setup-commands"

export const setupCommandInteraction = (client: Client): void => {

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const command = commands.get(interaction.commandName)
        if (!command) return

        await command.exec(interaction, client)
    });
}