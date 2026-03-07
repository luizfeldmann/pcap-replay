import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  Link,
} from "react-router-dom";
import {
  AppBar,
  Tab,
  Tabs,
  Typography,
  Toolbar,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FilesPage } from "./pages/files/FilesPage";
import { NetworkPage } from "./pages/network/NetworkPage";
import { ReplaysPage } from "./pages/replay/ReplaysPage";
import { routes } from "./utils/routes";
import { Icons } from "./utils/Icons";
import { LanguageSelector } from "./components/LanguageSelector/LanguageSelector";
import { ReplayFormPageEdit } from "./pages/replay/ReplayFormPageEdit";
import { ReplayFormPageCreate } from "./pages/replay/ReplayFormPageCreate";
import { AboutPage } from "./pages/about/AboutPage";

const tabs = [
  {
    path: routes.networkPage.path,
    location: routes.networkPage.location,
    page: <NetworkPage />,
    label: "nav.tabs.network",
    icon: <Icons.Network />,
  },
  {
    path: routes.filesPage.path,
    location: routes.filesPage.location,
    page: <FilesPage />,
    label: "nav.tabs.files",
    icon: <Icons.Files />,
  },
  {
    path: routes.replaysViewPage.path,
    location: routes.replaysViewPage.location,
    page: <ReplaysPage />,
    label: "nav.tabs.replays",
    icon: <Icons.Replays />,
  },
];

const AppLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  let currentTab: number | false = tabs.findIndex((t) =>
    location.pathname.startsWith(t.location),
  );
  if (currentTab === -1) currentTab = false;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.path}
                label={t(tab.label)}
                icon={tab.icon}
                iconPosition="start"
                sx={{ minHeight: "auto" }}
                component={Link}
                to={tab.location}
              />
            ))}
          </Tabs>
          <Box sx={{ flexGrow: 1 }} />
          <LanguageSelector />
          <Tooltip title={t("nav.links.apidocs")}>
            <IconButton
              color="inherit"
              size="small"
              href={routes.apiDocs.location}
            >
              <Icons.ApiDocs />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("about.label")}>
            <IconButton
              color="inherit"
              size="small"
              href={routes.about.location}
            >
              <Icons.About />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 2, flexGrow: 1, display: "flex" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          index
          element={<Navigate to={routes.networkPage.location} replace />}
        />
        {tabs.map((t) => (
          <Route key={t.path} path={t.path} element={t.page} />
        ))}
        <Route
          path={routes.replaysCreatePage.path}
          element={<ReplayFormPageCreate />}
        />
        <Route
          path={routes.replaysEditPage.path}
          element={<ReplayFormPageEdit />}
        />
        <Route path={routes.about.path} element={<AboutPage />} />
      </Route>
    </Routes>
  );
};
