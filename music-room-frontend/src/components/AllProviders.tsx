"use client"
import { store } from "@/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

interface Props {
    children : React.ReactNode
}

const AllProviders = ({ children } : Props) => {
    return (
        <Provider store={store} >
        <SessionProvider>
            {children}
        </SessionProvider>
        </Provider>
    )
}

export default AllProviders;