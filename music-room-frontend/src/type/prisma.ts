
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