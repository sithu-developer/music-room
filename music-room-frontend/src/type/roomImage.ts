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
    gifImage ?: File;
    adminId ?: number;
    userId ?: number;
}