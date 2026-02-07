import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { initI18n } from "./i18n";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

await initI18n();
const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
