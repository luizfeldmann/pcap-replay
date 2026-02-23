import {
  Accordion,
  AccordionDetails,
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
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
import type { ReplayPost } from "shared";
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

export const ReplayForm = (props: {
  initState: ReplayPost;
  labelSubmit: string;
  isLoading: boolean;
  error?: string;
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
    formState: { isValid },
  } = useForm<ReplayPost>({
    mode: "onTouched",
    defaultValues: props.initState,
  });

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
        name="interface"
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
      <Stack spacing={0}>
        <Accordion>
          <SectionHeader>
            <Icons.Loop />
            {t("replays.form.repeat.label")}
          </SectionHeader>
          <AccordionDetails>
            <Controller
              control={control}
              name="repeat"
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
              name="limit"
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
              name="load"
              render={({ field }) => (
                <ReplaySpeedEdit
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
              name="portRemap"
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
              <Typography variant="overline">
                {t("replays.form.addressremap.source")}
              </Typography>
              <Controller
                control={control}
                name="srcRemap"
                render={({ field }) => (
                  <AddressRemapEdit
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Divider flexItem />
              <Typography variant="overline">
                {t("replays.form.addressremap.dest")}
              </Typography>
              <Controller
                control={control}
                name="dstRemap"
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
      {props.error && <Alert severity="error">{props.error}</Alert>}
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
