export interface IsSuccessOrFailType {
    onSuccess ?: ( value ?: unknown ) => void
    onFail ?: ( value ?: unknown ) => void
}

export interface AdminSignInType extends IsSuccessOrFailType {
    email : string;
}