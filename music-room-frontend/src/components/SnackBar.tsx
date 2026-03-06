import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeSnackBarItems } from "@/store/slices/generalSlice";
import { Alert, Snackbar } from "@mui/material";

const SnackBar = () => {
    const snackBarItems = useAppSelector(store => store.general.snackBarItems);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(changeSnackBarItems({ open : false , message : "" , severity : "success" }))
    }

    return (
        <Snackbar open={snackBarItems.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={snackBarItems.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackBarItems.message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBar;