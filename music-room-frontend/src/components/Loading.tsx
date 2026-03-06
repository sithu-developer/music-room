import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Backdrop, CircularProgress } from "@mui/material";

const Loading = () => {
    const isLoading = useAppSelector(store => store.general.isLoading);


    return (
        
        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.tooltip + 1 })}
        open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default Loading;