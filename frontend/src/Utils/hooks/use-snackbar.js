import { snackbarContext } from "../contexts/snackbar-context"; 
import { useContext } from "react";

export function useSnackbar() {
    const snackbarHook = useContext(snackbarContext); 
    return (snackbarHook);
}