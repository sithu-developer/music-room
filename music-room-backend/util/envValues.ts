interface EnvValuesType {
    fontendUrl : string
}

export const envValues : EnvValuesType = {
    fontendUrl : process.env.FRONTEND_URL || "",
    
}