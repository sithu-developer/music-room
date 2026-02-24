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