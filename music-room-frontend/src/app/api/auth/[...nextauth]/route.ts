import { envValues } from "@/util/envValues"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Google({
    clientId: envValues.googleClientId,
    clientSecret: envValues.googleClientSecret
  })
    // ...add more providers here
  ],
}

// export default NextAuth(authOptions)

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };