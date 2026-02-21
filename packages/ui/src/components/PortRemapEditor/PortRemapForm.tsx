import { Button, Stack, TextField } from "@mui/material";
import { useEffect, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { PortRemap } from "shared";
import { Icons } from "../../constants/Icons";

type FormData = {
  start: number;
  end: number | undefined;
  to: number;
};

const remapToForm = (remap: PortRemap): FormData => ({
  start: typeof remap.from === "object" ? remap.from.start : remap.from,
  end: typeof remap.from === "object" ? remap.from.end : undefined,
  to: remap.to,
});

export const PortRemapForm = (props: {
  item?: PortRemap;
  delete(): void;
  apply(data: PortRemap): void;
}) => {
  const { t } = useTranslation();

  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormData>({
    mode: "all",
  });

  // Reset the form when the item loads
  useEffect(() => {
    // Copy values from selected item
    if (props.item) reset(remapToForm(props.item));
    else {
      // If no selection clear all fields
      reset({
        end: undefined,
        to: undefined,
        start: undefined,
      });
    }
  }, [reset, props.item]);

  // Convert the form format to the DTO format
  const onSubmit = (data: FormData) =>
    props.apply({
      to: data.to,
      from: data.end
        ? {
            start: data.start,
            end: data.end,
          }
        : data.start,
    });

  //! Prevent numerical edit from defaulting to zero when empty
  const getPortValue = (port?: number) => {
    if (port === undefined || port === 0) return "";
    return port;
  };

  //! Prevent empty numerical from coercing to zero in the state variables
  const convertPortValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const value = e.currentTarget.value;
    if (value === "") return undefined;
    return Number(value);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Controller
        control={control}
        name="start"
        rules={{
          required: t("replays.form.portremap.validate.from.required"),
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            value={getPortValue(field.value)}
            onChange={(e) => field.onChange(convertPortValue(e))}
            type="number"
            size="small"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            label={t("replays.form.portremap.start")}
            slotProps={{
              htmlInput: {
                min: 1,
                max: 65535,
              },
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="end"
        render={({ field }) => (
          <TextField
            {...field}
            value={getPortValue(field.value)}
            onChange={(e) => field.onChange(convertPortValue(e))}
            type="number"
            size="small"
            label={t("replays.form.portremap.end")}
            slotProps={{
              htmlInput: {
                min: 1,
                max: 65535,
              },
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="to"
        rules={{
          required: t("replays.form.portremap.validate.to.required"),
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            value={getPortValue(field.value)}
            onChange={(e) => field.onChange(convertPortValue(e))}
            type="number"
            size="small"
            label={t("replays.form.portremap.to")}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            slotProps={{
              htmlInput: {
                min: 1,
                max: 65535,
              },
            }}
          />
        )}
      />
      <Stack direction="row" spacing={2} justifyContent="flex-start">
        <Button
          startIcon={<Icons.Confirm />}
          disabled={!isValid}
          variant="contained"
          onClick={(e) => void handleSubmit(onSubmit)(e)}
        >
          {t("replays.form.portremap.apply")}
        </Button>
        <Button
          startIcon={<Icons.Delete />}
          variant="outlined"
          disabled={props.item == undefined}
          onClick={props.delete}
        >
          {t("replays.form.portremap.delete")}
        </Button>
      </Stack>
    </Stack>
  );
};
