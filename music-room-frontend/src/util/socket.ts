import { io } from "socket.io-client";
import { envValues } from "./envValues";

export const socket = io(envValues.apiUrl)