import { z } from "zod";
import {
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddressRemap } from "shared";
import { Icons } from "../../constants/Icons";

export const AddressRemapEditRow = (props: {
  value?: AddressRemap;
  setValue(value: AddressRemap): void;
}) => {
  const { t } = useTranslation();
  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddressRemap>({
    mode: "onTouched",
  });

  // Reset the form when selected data changes
  useEffect(
    () =>
      reset(
        props.value
          ? props.value
          : { from: undefined, to: undefined, ip: undefined },
      ),
    [reset, props.value],
  );

  // Check the address matches the protocol
  const isValidAddress = (value: string, formData: AddressRemap): boolean => {
    if (formData.ip === "v4") return z.cidrv4().safeParse(value).success;
    else return z.cidrv6().safeParse(value).success;
  };

  return (
    <TableRow>
      <TableCell>
        <Controller
          control={control}
          name="ip"
          rules={{
            required: t("replays.form.addressremap.validate.proto.required"),
          }}
          render={({ field, fieldState }) => (
            <Select
              size="small"
              MenuProps={{ disablePortal: true }}
              {...field}
              error={!!fieldState.error}
            >
              <MenuItem value="v4">
                {t("replays.form.addressremap.proto4")}
              </MenuItem>
              <MenuItem value="v6">
                {t("replays.form.addressremap.proto6")}
              </MenuItem>
            </Select>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="from"
          rules={{
            required: t("replays.form.addressremap.validate.from.required"),
            validate: {
              address: (v, f) =>
                isValidAddress(v, f) ||
                t("replays.form.addressremap.validate.from.invalid"),
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              size="small"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name="to"
          rules={{
            required: t("replays.form.addressremap.validate.to.required"),
            validate: {
              address: (v, f) =>
                isValidAddress(v, f) ||
                t("replays.form.addressremap.validate.to.invalid"),
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              size="small"
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </TableCell>
      <TableCell>
        <IconButton
          disabled={!isValid}
          color="primary"
          onClick={(e) => void handleSubmit(props.setValue)(e)}
        >
          <Icons.Confirm />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
