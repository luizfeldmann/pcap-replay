import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { initI18n } from "./i18n";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import "./index.css";
import { CacheNormalization } from "./components/CacheNormalization/CacheNormalization.tsx";

// Possibly mock server
if (__MOCK__) {
  const { mockWorker } = await import("./mocks/msw");
  await mockWorker.start();
}

// MUI theme
const theme = createTheme({});

// Locate root element in DOM
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Localization provider
await initI18n();

// Client for REST queries
const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <CacheNormalization />
          <SnackbarProvider maxSnack={5}>
            <App />
          </SnackbarProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
