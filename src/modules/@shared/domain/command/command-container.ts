import { BaseSlashCommand } from "./base-slash-command";


export class CommandContainer {

    commands: BaseSlashCommand[] = []

    constructor() { }

    addCommand(command: BaseSlashCommand): void {
        this.commands.push(command)
    }

    getCommands(): BaseSlashCommand[] {
        return this.commands
    }

    toJSON(): BaseSlashCommand.PropsJSON[] {
        return this.commands?.map(command => command.toJSON())
    }

}

export namespace CommandContainer {

}