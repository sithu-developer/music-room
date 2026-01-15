"use client"
import { store } from "@/store";
import { theme } from "@/util/theme";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

interface Props {
    children : React.ReactNode
}

const AllProviders = ({ children } : Props) => {
    return (
        <Provider store={store} >
            <SessionProvider>
                <ThemeProvider theme={theme} >
                {children}
                </ThemeProvider>
            </SessionProvider>
        </Provider>
    )
}

export default AllProviders;