import { IsSuccessOrFailType } from "./admin";

export interface NewCategory extends IsSuccessOrFailType {
    name : string;
    iconUrl : string;
    adminId : number
}