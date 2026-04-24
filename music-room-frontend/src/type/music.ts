import { IsSuccessOrFailType } from "./admin";
import { Music } from "./prisma";

export interface DefaultNewMusicType {
    name : string;
    music ?: File
}

export interface NewMusic extends IsSuccessOrFailType {
    name : string;
    musicUrl : string;
    adminId   ?: number
    userId    ?: number
}

export interface UpdateMusicDialogItems {
    open : boolean;
    selectedMusic : Music;
}

export interface UpdateMusic extends IsSuccessOrFailType {
    id : number;
    name : string;
    musicUrl : string;
}

export interface DeleteMusic extends IsSuccessOrFailType {
    id : number;
}