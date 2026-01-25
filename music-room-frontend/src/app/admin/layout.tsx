"use client"
import AdminSideBar from "@/components/AdminSideBar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { adminSignIn } from "@/store/slices/adminSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children : React.ReactNode
}

const AdminLayout = ( { children } : Props) => {
    const { data } = useSession();
    const admin = useAppSelector(store => store.admin.item);
    const dispatch = useAppDispatch();
    const path = usePathname();
    const router = useRouter();
    
    useEffect(() => {
        if(data && data.user && data.user.email && !admin) {
            dispatch(adminSignIn({ email : data.user.email , onSuccess : () => {
                if(path === "/admin") {
                    router.push("/admin/category");
                }
            } }))
        }
    } , [ data ]);

    
    return (
        <Box>
            {path !== "/admin" && <AdminSideBar />}
            <Box>
                {children}
            </Box>
        </Box>
    )
}

export default AdminLayout;