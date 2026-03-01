
export interface Admin {
    id: number;
    email: string;
    name : string;
}

export interface RoomCategory {
    id    : number
    name : string;
    iconUrl : string;
    adminId : number
}

export interface RoomImage {
    id        :  number
    vite      :  string
    bgImageUrl:  string
    adminId   ?: number
    userId    ?: number
}

export interface ExtraImage {
    id          : number
    imageUrl    : string
    roomImageId : number
    height      : string
    width       : string
    x           : number
    y           : number
}