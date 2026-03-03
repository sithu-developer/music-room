import { RoomCategory, RoomImage } from "./prisma";

export interface WarnningItemType {
    open : boolean;
    categoryToDelete ?: RoomCategory
    roomImageToDelete ?: RoomImage
}