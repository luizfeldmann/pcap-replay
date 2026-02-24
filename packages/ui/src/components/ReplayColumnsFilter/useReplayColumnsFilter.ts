import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// Names of all columns in the replays table
const replayColumnId = [
  "name",
  "status",
  "createdTime",
  "startedTime",
  "finishedTime",
  "interface",
  "file",
  "repeat",
  "speed",
  "length",
  "sourceremap",
  "destremap",
  "portremap",
] as const;

// Type keyed to the columns
export type ReplayColumnId = (typeof replayColumnId)[number];

// Gets a record mapped to each column
export const foreachColumn = <T>(
  fn: (id: ReplayColumnId) => T,
): Record<ReplayColumnId, T> =>
  replayColumnId.reduce(
    (acc, id) => {
      acc[id] = fn(id);
      return acc;
    },
    {} as Record<ReplayColumnId, T>,
  );

// Maps the names of the columns to the translation keys
export const useColumnNames = () => {
  const { t } = useTranslation();
  return useMemo<Record<ReplayColumnId, string>>(
    () => ({
      name: t("replays.table.name"),
      status: t("replays.table.status"),
      createdTime: t("replays.table.createdtime"),
      startedTime: t("replays.table.startedtime"),
      finishedTime: t("replays.table.finishedtime"),
      file: t("replays.table.interface"),
      interface: t("replays.table.file"),
      repeat: t("replays.table.repeat.label"),
      speed: t("replays.table.speed.label"),
      length: t("replays.table.length.label"),
      sourceremap: t("replays.table.sourceremap.label"),
      destremap: t("replays.table.destremap.label"),
      portremap: t("replays.table.portremap.label"),
    }),
    [t],
  );
};

//! State storing the visibility of each column
export const useReplayColumnFilter = () => {
  const [state, setState] = useState<Record<ReplayColumnId, boolean>>(
    foreachColumn((_) => true),
  );

  return {
    state,
    setColumn: (id: ReplayColumnId, visible: boolean) =>
      setState((prev) => ({ ...prev, [id]: visible })),
  };
};
