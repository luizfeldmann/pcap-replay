import {
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import {
  LicenseBox,
  LicenseTypography,
  Section,
  VersionTypography,
} from "./AboutPage.style";
import licenseText from "../../../../../LICENSE?raw";
import { author, repository, version } from "../../../../../package.json";
import { useMemo } from "react";

export const AboutPage = () => {
  const { t, i18n } = useTranslation();

  const build = useMemo(
    () =>
      Intl.DateTimeFormat(i18n.language, {
        timeStyle: "medium",
        dateStyle: "medium",
      }).format(new Date(__BUILD_TIMESTAMP__)),
    [],
  );

  return (
    <Stack
      spacing={1}
      sx={{ display: "flex", flexGrow: 1, position: "relative" }}
    >
      <Typography variant="h6">
        <Trans i18nKey="about.title" components={{ b: <strong /> }} />
      </Typography>
      <Typography variant="body1">{t("about.headline")}</Typography>
      <Section>{t("about.version.label")}</Section>
      <VersionTypography>
        {t("about.version.value", { version, build })}
      </VersionTypography>
      <Typography variant="body1">
        <Trans
          i18nKey={"about.version.viewsource"}
          components={{
            a: <Link href={repository.url} target="_blank" />,
          }}
        />
      </Typography>
      <Section>{t("about.contributors")}</Section>
      <List sx={{ listStyleType: "disc", pl: 3 }}>
        <ListItem sx={{ display: "list-item" }} disablePadding>
          <ListItemText>
            <Link href={author.url} target="_blank">
              {author.name}
            </Link>
          </ListItemText>
        </ListItem>
      </List>
      <Section>{t("about.license")}</Section>
      <LicenseBox>
        <LicenseTypography>{licenseText}</LicenseTypography>
      </LicenseBox>
    </Stack>
  );
};
