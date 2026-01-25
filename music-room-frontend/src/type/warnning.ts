import { RoomCategory } from "./prisma";

export interface WarnningItemType {
    open : boolean;
    categoryToDelete ?: RoomCategory
}