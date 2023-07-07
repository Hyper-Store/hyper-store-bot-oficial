import { ChatInputCommandInteraction, ClientEvents } from "discord.js"
import { Client } from "discord.js"

export abstract class BaseEvent {

    constructor(
        private readonly props: BaseEvent.Props
    ) { }

    getEventName(): string {
        return this.props.event
    }

    abstract exec(interaction: any, client: Client): Promise<void>

    setupConsumer(client: Client): void {
        client.on(this.getEventName(), (interaction) => { this.exec(interaction, client) })
    }
}

export namespace BaseEvent {

    export type Events = keyof ClientEvents

    export type Props = {
        event: Events
    }
}