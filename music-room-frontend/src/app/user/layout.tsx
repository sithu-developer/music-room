"use client"

import { Box } from "@mui/material"
import { useSession } from "next-auth/react"

interface Props {
    children : React.ReactNode
}

const UserLayout = ({ children } : Props ) => {
    const { data : session } = useSession();
    console.log(session)

    return (
        <Box >
            {children}
        </Box>
    )
}

export default UserLayout;