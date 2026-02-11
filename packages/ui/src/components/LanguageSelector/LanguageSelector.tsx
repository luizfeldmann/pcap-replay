import { IconButton, Menu, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "../../constants/Icons";

export const LanguageSelector = () => {
  // Find connection between the language code and display name
  const { i18n } = useTranslation();
  const languageOptions = useMemo(
    () =>
      Object.keys(i18n.options.resources ?? {}).reduce<Record<string, string>>(
        (acc, name) => {
          acc[name] = i18n.getResource(name, "translation", "language");
          return acc;
        },
        {},
      ),
    [i18n],
  );

  // Context menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        color="inherit"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Icons.Language />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            minWidth: 180, // width of menu
            maxHeight: 400, // allow enough vertical space
          },
        }}
      >
        {Object.entries(languageOptions).map(([code, label]) => (
          <MenuItem
            key={code}
            value={code}
            selected={i18n.language === code}
            onClick={() => {
              void i18n.changeLanguage(code);
              setAnchorEl(null);
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
