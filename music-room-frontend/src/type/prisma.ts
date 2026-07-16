
export interface Admin {
    id: number;
    email: string;
    companyName : string;
    companyLogoUrl ?: string
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

export interface Music {
    id    : number
    name : string;
    musicUrl : string;
    adminId   ?: number
    userId    ?: number
}


export interface User {
    id      : number
    email   : string    
    name    : string
    url     : string
    adminId : number
}


export interface Room {
  id                 : number   
  name               : string
  roomPassword      ?: string
  roommateQty        : number
  currentRoomImageId : number
  playingMusicId     : number
  ownerUserId        : number
  roomCategoryId     : number
}


export interface Roommates {
  id                     : number 
  roomId                 : number
  userId                ?: number
  height                 : string
  width                  : string
  x                      : number
  y                      : number
  requestMusicId        ?: number
  requestRoomImageId    ?: number
}