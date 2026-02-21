import { IconButton, Menu, MenuItem } from "@mui/material";
import { Icons } from "../../utils/Icons";
import { useLanguageSelector } from "./useLanguageSelector";

export const LanguageSelector = () => {
  const {
    isOpen,
    anchorEl,
    setAnchorEl,
    languageOptions,
    currentLanguage,
    changeLanguage,
  } = useLanguageSelector();

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
        open={isOpen}
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
            selected={currentLanguage === code}
            onClick={() => {
              changeLanguage(code);
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
