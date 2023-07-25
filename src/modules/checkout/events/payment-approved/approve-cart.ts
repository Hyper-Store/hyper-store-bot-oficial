import { Client } from "discord.js";
import { CheckoutRepository } from "../../repositories/Checkout.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CheckoutProductMessagePrivate } from "./messages/CheckoutProductMessagePrivate.message";
import { ProductStockModel } from "@/modules/product/models/product-stock.model";
import { RabbitmqSingletonService } from "@/modules/@shared/services";
import { CheckoutProductMessageChannel } from "./messages/CheckoutProductMessageChannel.message";
import { DatabaseConfig } from "@/infra/app/setup-config";
import { LogsPublicSaleMessage } from "./messages/LogsPublicSale.message";

export class ApproveCartUsecase {
    static async execute(client: Client, { checkoutId, stocks }: ApproveCartUsecase.Input): Promise<void | boolean> {
        const checkout = await CheckoutRepository.findById(checkoutId);
        const product = await ProductRepository.findById(checkout?.productId!);
        const guild = await client.guilds.cache.get(process.env.GUILD_ID!);
        const channel = guild?.channels.cache.get(checkout?.id!);
        const owner = guild?.members.cache.get(checkout?.ownerId!);

        if (!owner || !channel || !channel.isTextBased()) return;

        await channel.send({
            ...await CheckoutProductMessageChannel({
                client,
                user: owner,
                product: product!,
                checkout: checkout!
            })
        })

        const checkoutConfig = await new DatabaseConfig().get('purchases') as any;

        if (!owner.roles.cache.get(checkoutConfig.role_customer)) {
            await owner.roles.add(checkoutConfig.role_customer)
        }

        if (product?.roleDelivery) {
            await owner.roles.add(product.roleDelivery);
        }

        owner?.send({
            ...await CheckoutProductMessagePrivate({
                client,
                user: owner,
                product: product!,
                stock: stocks,
                checkout: checkout!
            })
        })

        const rabbitmq = await RabbitmqSingletonService.getInstance()
        await rabbitmq.publishInExchange(
            "checkout",
            "checkout.delivered",
            JSON.stringify({
                checkoutId: checkout?.id
            })
        )

        setTimeout(async () => {
            const channel_logs_public = guild?.channels.cache.get(checkoutConfig.channel_logs_public)
            if (channel_logs_public && channel_logs_public.isTextBased()) channel_logs_public.send({
                ...await LogsPublicSaleMessage({
                    user: owner!,
                    checkout: checkout!,
                    client,
                    guild: guild!,
                    product: product!
                })
            })
        }, 1000);

        return true
    }
}

export namespace ApproveCartUsecase {

    export type Input = {
        checkoutId: string
        stocks: ProductStockModel[]
    }
}