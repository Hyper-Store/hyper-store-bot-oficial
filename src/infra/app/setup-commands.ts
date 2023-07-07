import { BaseSlashCommand, CommandContainer } from "@/modules/@shared/domain"
import fg from "fast-glob"
import Discord from "discord.js"

export const commands = new Discord.Collection<string, BaseSlashCommand>();
export const setupCommand = (client: any): void => {

    const commandContainer = new CommandContainer()
    fg.sync("**/src/modules/**/**.command.ts")
        .map(async file => { (await import(`../../../${file}`)).default(commandContainer) })

    client.on("ready", async () => {
        commandContainer.getCommands().forEach(command => {
            commands.set(command.name, command)
        })

        await client.guilds.cache.get(process.env.GUILD_ID).commands.set(commandContainer.toJSON());
        await client.application.commands.set(commandContainer.toJSON());
    });
}