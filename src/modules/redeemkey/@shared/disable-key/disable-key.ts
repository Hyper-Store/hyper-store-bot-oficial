import { KeyModel } from "../../models/Key.model";
import { KeyRepository } from "../../repositories/Keys.repository";

export const DisableKey = async (key: KeyModel, userId: string) => {
    return await KeyRepository.update({
        ...key,
        recued: true,
        rescuedBy: userId,
        rescuedAt: new Date()
    })
}