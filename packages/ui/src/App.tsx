import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppBar, Tab, Tabs, Typography, Toolbar, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FilesPage } from "./pages/files/FilesPage";
import { NetworkPage } from "./pages/network/NetworkPage";
import { ReplaysPage } from "./pages/replay/ReplaysPage";

import routes from "./constants/routes.json";
import { Icons } from "./constants/Icons";

const tabs = [
  {
    path: routes.network,
    location: "/" + routes.network,
    page: <NetworkPage />,
    label: "nav.tabs.network",
    icon: <Icons.Network />,
  },
  {
    path: routes.files,
    location: "/" + routes.files,
    page: <FilesPage />,
    label: "nav.tabs.files",
    icon: <Icons.Files />,
  },
  {
    path: routes.replays,
    location: "/" + routes.replays,
    page: <ReplaysPage />,
    label: "nav.tabs.replays",
    icon: <Icons.Replays />,
  },
];

const AppLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = Math.max(
    0,
    tabs.findIndex((t) => location.pathname.startsWith(t.location)),
  );

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {t("app.title")}
          </Typography>
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            value={currentTab}
            onChange={(_, index) => {
              void navigate(tabs[index].path);
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.path}
                label={t(tab.label)}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: "auto" }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to={routes.network} replace />} />
        {tabs.map((t) => (
          <Route key={t.path} path={t.path} element={t.page} />
        ))}
      </Route>
    </Routes>
  );
};
