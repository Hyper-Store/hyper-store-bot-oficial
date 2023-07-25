import { Client } from "discord.js";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { LogsPublicSaleMessage } from "./messages/LogsPublicSale.message";
import { CloseChannelCheckoutRabbitMq } from "../../@shared/rabbitmq/close-channel-checkout.rabbitmq";

export class HandleReviewUsecase {
    static async execute(client: Client, { checkoutId }: HandleReviewUsecase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (checkout?.reviewSent) return;

        await CheckoutRepository.update({
            ...checkout!,
            reviewSent: true
        })

        const checkoutConfig = await new DatabaseConfig().get('purchases') as any;
        const channel_logs_public = guild?.channels.cache.get(checkoutConfig.channel_logs_public)
        if (channel_logs_public && channel_logs_public.isTextBased()) channel_logs_public.send({
            ...await LogsPublicSaleMessage({
                checkout: checkout!,
                client,
                guild: guild!,
                product: product!,
                user: owner!
            })
        })

        await CloseChannelCheckoutRabbitMq.execute({ checkoutId });
        return;
    }
}

export namespace HandleReviewUsecase {
    export type Input = {
        checkoutId: string
    }
}