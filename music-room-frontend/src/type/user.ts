export interface IsSuccessOrFailType {
    onSuccess ?: ( value ?: unknown ) => void
    onFail ?: ( value ?: unknown ) => void
}

export interface UserSignInType extends IsSuccessOrFailType {
    email : string;
}