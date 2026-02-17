import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ReplayPost } from "shared";
import { useNetworkInterfaces } from "../../api/networkInterfaces";
import { Icons } from "../../constants/Icons";
import { ReplayRepetitionEdit } from "../ReplayRepetitionEdit/ReplayRepetitionEdit";
import { ReplayLengthEdit } from "../ReplayLengthEdit/ReplayLengthEdit";
import { Link } from "react-router-dom";
import routes from "../../constants/routes.json";
import { ReplaySpeedEdit } from "../ReplaySpeedEdit/ReplaySpeedEdit";

export const ReplayForm = (props: {
  initState: ReplayPost;
  labelSubmit: string;
}) => {
  // Query required options
  const interfaces = useNetworkInterfaces();

  // Form control
  const { t } = useTranslation();
  const { handleSubmit, reset, control } = useForm<ReplayPost>({
    defaultValues: props.initState,
  });

  // Reset the form state when the initial values change
  useEffect(() => reset(props.initState), [reset, props.initState]);

  const onSubmit = (_formData: ReplayPost) => {};

  return (
    <Stack
      component="form"
      spacing={2}
      sx={{
        alignItems: "flex-start",
        minWidth: 400,
      }}
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
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
      <Divider flexItem />
      <Controller
        control={control}
        name="repeat"
        render={({ field }) => (
          <FormControl>
            <FormLabel>{t("replays.form.repeat.label")}</FormLabel>
            <ReplayRepetitionEdit
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
        )}
      />
      <Divider flexItem />
      <Controller
        control={control}
        name="limit"
        render={({ field }) => (
          <FormControl>
            <FormLabel>{t("replays.form.limit.label")}</FormLabel>
            <ReplayLengthEdit value={field.value} onChange={field.onChange} />
          </FormControl>
        )}
      />
      <Divider flexItem />
      <FormControl>
        <FormLabel>{t("replays.form.speed.label")}</FormLabel>
        <Controller
          control={control}
          name="load"
          render={({ field }) => (
            <ReplaySpeedEdit value={field.value} onChange={field.onChange} />
          )}
        />
      </FormControl>
      <Divider flexItem />
      <Stack direction="row" spacing={2} justifyContent="flex-start">
        <Button startIcon={<Icons.Confirm />} variant="contained" type="submit">
          {props.labelSubmit}
        </Button>
        <Button
          startIcon={<Icons.Cancel />}
          variant="outlined"
          component={Link}
          to={"/" + routes.replays}
        >
          {t("replays.form.button.cancel")}
        </Button>
      </Stack>
    </Stack>
  );
};
