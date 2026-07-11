import { IsSuccessOrFailType } from "./admin";
import { Music, RoomImage } from "./prisma";

export interface NewRoomType {
  name               : string;
  roomPassword       : string
  roommateQty        : number
  currentRoomImage   : RoomImage | null
  playingMusic       : Music | null
  roomCategoryId     : number
}

export interface CreateNewRoomParaType extends IsSuccessOrFailType {
  name               : string
  roomPassword      ?: string
  roommateQty        : number
  currentRoomImageId : number
  playingMusicId     : number
  ownerUserId        : number
  roomCategoryId     : number
  roomMateLayouts    : RoomMateLayoutType[]
}

export interface RoomMateLayoutType {
  tempId : number,
  x      : number,
  y      : number,
  h      : string,
  w      : string,
}