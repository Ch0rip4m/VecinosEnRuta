import React, { createContext, useCallback } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { notistackStyledComponent } from '../themes/notistack-style';

export const snackbarContext = createContext();

export function GlobalSnackbarProvider({children}) {

  return (
    <SnackbarProvider
      maxSnack={4}
      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      autoHideDuration={3000}
      Components={notistackStyledComponent()}
    >
      <SnackbarHookProvider>
        {children}
      </SnackbarHookProvider>
    </SnackbarProvider>
  );
}

export function SnackbarHookProvider({ children }) {

  const snackbarHook = useSnackbarHook();

  return (
      <snackbarContext.Provider value={snackbarHook}>
        {children}
      </snackbarContext.Provider>

  );
};

export function useSnackbarHook() {

  const { enqueueSnackbar } = useSnackbar();

  const handleDefault = useCallback((message) => {
    enqueueSnackbar(message, { variant: "default" });
  }, []);

  const handleSuccess = useCallback((message) => {
    enqueueSnackbar(message, { variant: "success" });
  }, []);

  const handleError = useCallback((message) => {
    enqueueSnackbar(message, { variant: "error" });
  }, []);

  const handleWarning = useCallback((message) => {
    enqueueSnackbar(message, { variant: "warning" });
  }, []);

  const handleInfo = useCallback((message) => {
    enqueueSnackbar(message, { variant: "info" });
  }, []);

  return {
    enqueueSnackbar,
    default: handleDefault,
    success: handleSuccess,
    error: handleError,
    warning: handleWarning,
    info: handleInfo,
  };
}