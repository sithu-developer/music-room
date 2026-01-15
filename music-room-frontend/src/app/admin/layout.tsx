"use client"
import AdminSideBar from "@/components/AdminSideBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { userSignIn } from "@/store/slices/userSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children : React.ReactNode
}

const AdminLayout = ( { children } : Props) => {
    const { data } = useSession();
    const user = useAppSelector(store => store.user.item);
    const dispatch = useAppDispatch();
    const path = usePathname();
    const router = useRouter();
    
    useEffect(() => {
        if(data && data.user && data.user.email && !user) {
            dispatch(userSignIn({ email : data.user.email , onSuccess : () => {
                if(path === "/admin") {
                    router.push("/admin/modification");
                }
            } }))
        }
    } , [ data ]);

    if(!user) return null;
    return (
        <Box>
            <AdminSideBar />
            <Box>
                {children}
            </Box>
        </Box>
    )
}

export default AdminLayout;