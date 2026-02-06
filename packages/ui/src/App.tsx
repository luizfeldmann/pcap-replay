import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FilesPage } from "./pages/files/FilesPage";
import { NetworkPage } from "./pages/network/NetworkPage";
import { ReplaysPage } from "./pages/replay/ReplaysPage";

import routes from "./constants/routes.json";

const tabs = [
  {
    path: routes.network,
    location: "/" + routes.network,
    page: <NetworkPage />,
    label: "nav.tabs.network",
  },
  {
    path: routes.files,
    location: "/" + routes.files,
    page: <FilesPage />,
    label: "nav.tabs.files",
  },
  {
    path: routes.replays,
    location: "/" + routes.replays,
    page: <ReplaysPage />,
    label: "nav.tabs.replays",
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
      <Typography variant="h4">{t("app.title")}</Typography>
      <Tabs
        value={currentTab}
        onChange={(_, index) => navigate(tabs[index].path)}
      >
        {tabs.map((tab) => (
          <Tab key={tab.path} label={t(tab.label)} />
        ))}
      </Tabs>
      <Outlet />
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
