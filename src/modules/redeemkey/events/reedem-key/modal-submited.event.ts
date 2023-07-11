import { BaseEvent } from "@/modules/@shared/domain";
import { Interaction } from "discord.js";
import { Client } from "discord.js"
import { DisableKey } from "../../@shared/disable-key/disable-key";
import { KeyRepository } from "../../repositories/Keys.repository";
import { KeyInvalidMessage } from "./messages/key-invalid.message";
import { KeyAlreadyRescuedMessage } from "./messages/key-already-rescued.message";
import { KeyRescueErrorMessage } from "./messages/key-rescue-error.message";
import { KeyRescueMessageSuccessChannelMessage } from "./messages/key-rescue-message-channel.message";
import { KeyRescueMessageSuccessPrivateMessage } from "./messages/key-rescue-message-private.message";
import { KeyRescueRoleSuccessMessage } from "./messages/key-rescue-role-success.message";
import { KeyErrorInRescue } from "./messages/key-error-in-rescue";


class ModalSubmitedReedemKeyEvent extends BaseEvent {
    constructor() {
        super({
            event: "interactionCreate"
        })
    }

    async exec(interaction: Interaction): Promise<void> {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "reedem_key") return;

        const keyId = interaction.fields.getTextInputValue("key");

        const key_db = await KeyRepository.findById(keyId);

        if (!key_db) {
            interaction.reply({ ...KeyInvalidMessage({ interaction, keyId }) })

            return;
        }

        if (key_db.recued) {
            interaction.reply({ ...KeyAlreadyRescuedMessage({ interaction, keyId }) })
            return;
        }

        switch (key_db.type) {
            case "role":
                try {
                    if (Array.isArray(interaction.member?.roles)) return;
                    interaction.member?.roles.add(key_db.content);
                } catch (error) {
                    interaction.reply({ ...KeyRescueErrorMessage({ interaction }) })
                    return;
                }

                await DisableKey(key_db, interaction.user.id);

                interaction.reply({ ...KeyRescueRoleSuccessMessage({ interaction, key: key_db }) })
                break;

            case "message":
                await interaction.user.send({ ...KeyRescueMessageSuccessPrivateMessage({ interaction, key: key_db }) })

                await DisableKey(key_db, interaction.user.id);

                interaction.reply({ ...KeyRescueMessageSuccessChannelMessage({ interaction }) })
                break
            default:
                interaction.reply({ ...KeyErrorInRescue({ interaction }) })
                break;
        }
    }
}

export default (client: Client): void => {
    const buttonClickedEvent = new ModalSubmitedReedemKeyEvent()
    buttonClickedEvent.setupConsumer(client)
}