export interface NewExtraImage {
    imageUrl    : string
    height      : string
    width       : string
    x           : number
    y           : number 
}

export interface RoomMateLayoutType {
  tempId : number,
  x      : number,
  y      : number,
  h      : string,
  w      : string,
}

// for scoket.io 

import { Server } from "socket.io"

declare global {
  namespace Express {
    interface Request {
      io : Server
    }
  }
}
