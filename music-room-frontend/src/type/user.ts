import { IsSuccessOrFailType } from "./admin"

export interface UserSignInData extends IsSuccessOrFailType  {
    email   : string    
    name    : string
    url     : string
}