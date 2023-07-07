import { BaseEvent } from "@/modules/@shared/domain";
import { CacheType, Interaction, ClientEvents } from "discord.js";
import { Client } from "discord.js"
import { MessagePing } from "../../@shared/ping/message";


class UpdatePingEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction, client: Client): Promise<void> {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "update-ping") return;

        interaction.update({ ...MessagePing(interaction, client) })
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new UpdatePingEvent()
    buttonClickedEvent.setupConsumer(client)
}