import "dotenv/config"
import "./setup-database";
import Discord, { Client, Collection, Partials } from "discord.js"
import { setupCommand } from "./setup-commands";
import { setupCommandInteraction } from "./interaction-create";
import { setupEvents } from "./setup-events";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, any>;
        buttons: Collection<string, any>;
        modals: Collection<string, any>;
    }
}

const client = new Client({
    intents: [
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.MessageContent,
        Discord.IntentsBitField.Flags.GuildMembers,
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.User, Partials.ThreadMember]
})


client.commands = new Collection()
client.setMaxListeners(0)

client.login(process.env.TOKEN)

setupCommand(client)
setupCommandInteraction(client)
setupEvents(client)

export default client