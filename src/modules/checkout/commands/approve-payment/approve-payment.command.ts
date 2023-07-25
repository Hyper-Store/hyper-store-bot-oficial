import { CommandContainer } from "@/modules/@shared/domain";
import { BaseSlashCommand } from "@/modules/@shared/domain/command/base-slash-command";
import { NotHavePermissionMessage } from "@/modules/@shared/messages/not-have-permission/not-have-permission.message";
import { ApproveMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/application-actions";
import { ChatInputCommandInteraction, Client } from "discord.js";
import Discord from "discord.js"
import { PaymentNotFoundMessage } from "./messages/PaymentNotFound.message";
import { PaymentAlreadyApprovedMessage } from "./messages/PaymentAlreadyApproved.message";
import { PaymentApprovedSucessfullyMessage } from "./messages/PaymentApprovedSucessfully.message";

class ApprovePaymentCommand extends BaseSlashCommand {
    constructor() {
        super({
            name: "approve-papyment",
            description: "Adicionar uma opção a um pack",
            options: [
                {
                    name: 'paymentid',
                    description: 'Insira o id do pagamento',
                    type: 3,
                    required: true
                }
            ],
            type: Discord.ApplicationCommandType.ChatInput
        })
    }

    async exec(interaction: ChatInputCommandInteraction, client: Client): Promise<void> {
        if (!interaction.memberPermissions?.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ ...NotHavePermissionMessage({ interaction, client, permission: "Administrator" }) })
            return;
        }

        const paymentId = interaction.options.getString('paymentid') as string;
        const result = await ApproveMercadopagoPaymentUsecase.execute({ mercadopagoPaymentId: paymentId! })

        if (result === "PaymentNotFound") {
            interaction.reply({ ...PaymentNotFoundMessage({ interaction, paymentId }) })
            return;
        }

        if (result === "PaymentAlreadyApproved") {
            interaction.reply({ ...PaymentAlreadyApprovedMessage({ interaction, paymentId }) })
            return;
        }

        interaction.reply({ ...PaymentApprovedSucessfullyMessage({ interaction, paymentId }) });
        return;
    }
}


export default (commandContainer: CommandContainer): void => {
    const command = new ApprovePaymentCommand()
    commandContainer.addCommand(command)
}