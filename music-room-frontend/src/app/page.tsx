"use client"

import { Box, Button } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  return (
    <Box>
      {data && data.user?.email}
      {!data ? <Button variant="contained" onClick={() => signIn("google")} >Sign In with Google</Button>
      :<Button variant="contained" onClick={() => signOut()} >Sign Out</Button>}
    </Box>
  );
}
