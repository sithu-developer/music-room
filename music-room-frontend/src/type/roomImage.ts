import { IsSuccessOrFailType } from "./admin";

interface NewRoomImage {
    vite : string;
    bgImageUrl : string;
    gifImageUrl ?: string;
    adminId ?: number;
    userId ?: number;
}

export interface DefaultNewRoomImageType {
    vite : string;
    bgImage ?: File;
    adminId ?: number;
    userId ?: number;
}

export interface DefaultNewExtraImageType {
    tempId : string
    extraImage : File
    x : number,
    y : number,
    h : string
    w : string
}

export interface NewRoomImageItems extends IsSuccessOrFailType {
    vite : string
    bgImageUrl : string
    adminId ?: number
    userId ?: number
    extraImages : NewExtraImage[]
}

export interface NewExtraImage {
    imageUrl    : string
    height      : string
    width       : string
    x           : number
    y           : number 
}