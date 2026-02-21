import { Fab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/Icons";
import { Link } from "react-router-dom";
import { routes } from "../../utils/routes";

export const NewReplayButton = () => {
  const { t } = useTranslation();

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="create"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        margin: 0,
        zIndex: 10,
      }}
      component={Link}
      to={routes.replaysCreatePage.location()}
    >
      {<Icons.Add />}
      {t("replays.create.button")}
    </Fab>
  );
};
