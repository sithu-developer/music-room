import { IsSuccessOrFailType } from "./admin";

export interface NewChat extends IsSuccessOrFailType {
    message : string;
    userId  : number
    roomId  : number;
    replyId   ?: number
}