
import { ChatInputCommandInteraction, Client, PermissionResolvable, SlashCommandBuilder } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";


export abstract class BaseSlashCommand {

    constructor(
        private readonly props: BaseSlashCommand.Props
    ) { }

    abstract exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void>

    toJSON(): BaseSlashCommand.PropsJSON {
        return {
            ...this.props
        }
    }

    get name(): string {
        return this.props.name
    }

}

export namespace BaseSlashCommand {
    export type Props = RESTPostAPIApplicationCommandsJSONBody

    export type PropsJSON = Props
}