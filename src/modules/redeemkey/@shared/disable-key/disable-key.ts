import { Database } from "@/infra/app/setup-database"

export const DisableKey = async (key: string, userId: string) => {
    const db: any = await new Database().get(`reedemkey.${key}`);
    return await new Database().set(`reedemkey.${key}`, {
        ...db,
        status: false,
        rescuedBy: userId,
        rescuedAt: new Date()
    });
}