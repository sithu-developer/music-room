export interface IsSuccessOrFailType {
    success ?: ( value ?: unknown ) => void
    fail ?: ( value ?: unknown ) => void
}

export interface UserSignInType extends IsSuccessOrFailType {
    email : string;
}