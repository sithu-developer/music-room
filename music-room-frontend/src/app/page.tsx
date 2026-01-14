"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { userSignIn } from "@/store/slices/userSlice";
import { Box, Button, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data } = useSession();
  const user = useAppSelector(store => store.user.item);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(data && data.user && data.user.email && !user) {
      dispatch(userSignIn({ email : data.user.email }))
    }
  } , [ data ])

  return (
    <Box>
      {data && data.user?.email}
      {!data ? <Button variant="contained" onClick={() => signIn("google")} >Sign In with Google</Button>
      :<Button variant="contained" onClick={() => signOut()} >Sign Out</Button>}

      {user && <Typography>{user.email}</Typography>}
    </Box>
  );
}
