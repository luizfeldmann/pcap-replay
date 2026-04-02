import {
  Accordion,
  AccordionDetails,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ReplayPost, ReplayProviderEnum, LoadSettingsType } from "shared";
import { useNetworkInterfaces } from "../../api/networkInterfaces";
import { Icons } from "../../utils/Icons";
import { ReplayRepetitionEdit } from "../ReplayRepetitionEdit/ReplayRepetitionEdit";
import { ReplayLengthEdit } from "../ReplayLengthEdit/ReplayLengthEdit";
import { Link } from "react-router-dom";
import { routes } from "../../utils/routes";
import { ReplaySpeedEdit } from "../ReplaySpeedEdit/ReplaySpeedEdit";
import { PortRemapEditor } from "../PortRemapEditor/PortRemapEditor";
import { SectionHeader } from "./ReplayForm.styles";
import { AddressRemapEdit } from "../AddressRemapEdit/AddressRemapEdit";
import { FileSelectBox } from "../FileSelectBox/FileSelectBox";

const allowedSettingsPerProvider: Record<
  ReplayProviderEnum,
  {
    load: LoadSettingsType[];
  }
> = {
  dgram: {
    load: ["multiplier"],
  },
  tcpreplay: {
    load: ["mbps", "pps", "multiplier"],
  },
};

export const ReplayForm = (props: {
  initState: ReplayPost;
  labelSubmit: string;
  isLoading: boolean;
  onSubmit(formData: ReplayPost): void;
}) => {
  // Query required options
  const interfaces = useNetworkInterfaces();

  // Form control
  const { t } = useTranslation();
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isValid },
  } = useForm<ReplayPost>({
    mode: "onTouched",
    defaultValues: props.initState,
  });

  // The currently active provider
  const providerMode = watch("settings.provider");

  // Reset the form state when the initial values change
  useEffect(() => reset(props.initState), [reset, props.initState]);

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(e) => void handleSubmit(props.onSubmit)(e)}
    >
      <Controller
        control={control}
        name="name"
        rules={{
          required: t("replays.form.name.validate.required"),
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            autoFocus
            fullWidth
            label={t("replays.form.name.label")}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="settings.provider"
        rules={{
          required: t("replays.form.provider.required"),
        }}
        render={({ field, fieldState }) => (
          <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel id="replay-provider-select-label">
              {t("replays.form.provider.label")}
            </InputLabel>
            <Select
              {...field}
              labelId="replay-nic-provider-label"
              label={t("replays.form.provider.label")}
            >
              <MenuItem value="tcpreplay">
                {t("replays.form.provider.tcpreplay")}
              </MenuItem>
              <MenuItem value="udpreplay">
                {t("replays.form.provider.udpreplay")}
              </MenuItem>
            </Select>
            {!!fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
      {providerMode === "tcpreplay" && (
        <Controller
          control={control}
          name="settings.interface"
          rules={{
            required: t("replays.form.interface.required"),
          }}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel id="replay-nic-select-label">
                {t("replays.form.interface.label")}
              </InputLabel>
              <Select
                {...field}
                labelId="replay-nic-select-label"
                label={t("replays.form.interface.label")}
              >
                {interfaces.data?.map((item, i) => (
                  <MenuItem key={i} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              {!!fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      )}
      <Controller
        control={control}
        name="fileId"
        rules={{
          required: t("replays.form.file.validate.required"),
        }}
        render={({ field, fieldState }) => (
          <FileSelectBox
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={t("replays.form.file.label")}
            error={fieldState.error?.message}
          />
        )}
      />
      <Divider flexItem sx={{ margin: 2 }} />
      <Controller
        control={control}
        name="settings.verbose"
        render={({ field }) => (
          <FormControlLabel
            label={t("replays.form.verbose")}
            control={<Checkbox checked={field.value} {...field} />}
          />
        )}
      />
      <Stack spacing={0}>
        <Accordion>
          <SectionHeader>
            <Icons.Loop />
            {t("replays.form.repeat.label")}
          </SectionHeader>
          <AccordionDetails>
            <Controller
              control={control}
              name="settings.repeat"
              render={({ field }) => (
                <ReplayRepetitionEdit
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <SectionHeader>
            <Icons.LoadLimit />
            {t("replays.form.limit.label")}
          </SectionHeader>
          <AccordionDetails>
            <Controller
              control={control}
              name="settings.limit"
              render={({ field }) => (
                <ReplayLengthEdit
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <SectionHeader>
            <Icons.Speed />
            {t("replays.form.speed.label")}
          </SectionHeader>
          <AccordionDetails>
            <Controller
              control={control}
              name="settings.load"
              render={({ field }) => (
                <ReplaySpeedEdit
                  allowedTypes={allowedSettingsPerProvider[providerMode].load}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <SectionHeader>
            <Icons.PortRemap />
            {t("replays.form.portremap.label")}
          </SectionHeader>
          <AccordionDetails>
            <Controller
              control={control}
              name="settings.portRemap"
              render={({ field }) => (
                <PortRemapEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <SectionHeader>
            <Icons.AddressRemap />
            {t("replays.form.addressremap.label")}
          </SectionHeader>
          <AccordionDetails>
            <Stack direction="column" spacing={2}>
              {providerMode === "tcpreplay" && (
                <>
                  <Typography variant="overline">
                    {t("replays.form.addressremap.source")}
                  </Typography>
                  <Controller
                    control={control}
                    name="settings.srcRemap"
                    render={({ field }) => (
                      <AddressRemapEdit
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Divider flexItem />
                </>
              )}
              <Typography variant="overline">
                {t("replays.form.addressremap.dest")}
              </Typography>
              <Controller
                control={control}
                name="settings.dstRemap"
                render={({ field }) => (
                  <AddressRemapEdit
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <Divider flexItem />
      <Stack direction="row" spacing={2} justifyContent="flex-start">
        <Button
          startIcon={<Icons.Confirm />}
          variant="contained"
          type="submit"
          disabled={!isValid || props.isLoading}
        >
          {!props.isLoading && props.labelSubmit}
          {props.isLoading && <CircularProgress />}
        </Button>
        <Button
          startIcon={<Icons.Cancel />}
          variant="outlined"
          component={Link}
          to={routes.replaysViewPage.location}
        >
          {t("replays.form.button.cancel")}
        </Button>
      </Stack>
    </Stack>
  );
};
