import { IsSuccessOrFailType } from "./admin"

export interface JoinRoomParaType extends IsSuccessOrFailType {
    userId : number
    roomId : number
    roomPassword : string | null
}

export interface HandleJoinRoomParaType {
    roomId : number
    roomPassword : string | undefined
}

export interface RoomPasswordDialogItems {
    open : boolean;
    roomId : number
}