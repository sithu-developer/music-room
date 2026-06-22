import { Music, RoomImage } from "./prisma";

export interface NewRoomType {
    name : string;
    roomPassword       : string
    roommateQty        : number
    currentRoomImage   : RoomImage | null
    playingMusic       : Music | null
    ownerUserId        : number
} 