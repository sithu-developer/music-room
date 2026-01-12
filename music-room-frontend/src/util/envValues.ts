interface EnvValuesType {
    googleClientId : string
    googleClientSecret : string
}

export const envValues : EnvValuesType = {
    googleClientId : process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET || ""
}