import { BaseEvent } from "@/modules/@shared/domain";
import { CacheType, Interaction, ClientEvents } from "discord.js";
import { Client } from "discord.js"


class ButtonClickedEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction): Promise<void> {

    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ButtonClickedEvent()
    buttonClickedEvent.setupConsumer(client)
}