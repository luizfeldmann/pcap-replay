import type { JobCommand } from "shared";
import { useReplayCommand } from "../../api/replays/useReplayCommand";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";

export const useReplayCommandWithSnack = (id: string) => {
  const { t } = useTranslation();
  const { mutate: apiMutate, ...mutation } = useReplayCommand(id);

  const mutate = useCallback(
    (args: { name: string; command: JobCommand }, onSettled?: () => void) =>
      apiMutate(args, {
        onSettled,
        onSuccess: (_, variables) =>
          enqueueSnackbar(
            t(
              variables.command === "start"
                ? "replays.success.start"
                : "replays.success.stop",
              {
                name: variables.name,
              },
            ),
            {
              variant: "success",
            },
          ),
        onError: (error, variables) =>
          enqueueSnackbar(
            t(
              variables.command === "start"
                ? "replays.error.start"
                : "replays.error.stop",
              {
                name: variables.name,
                message: error.message,
              },
            ),
            {
              variant: "error",
            },
          ),
      }),
    [t, apiMutate],
  );

  return { mutate, ...mutation };
};
