import { Stack } from "@mui/material";
import type { PortRemap } from "shared";
import { PortRemapTable } from "./PortRemapTable";
import { useState } from "react";
import { PortRemapForm } from "./PortRemapForm";

export const PortRemapEditor = (props: {
  value?: PortRemap[];
  onChange(data?: PortRemap[]): void;
}) => {
  // Save the selected row
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const selectedItem =
    props.value && selectedIndex !== undefined
      ? props.value[selectedIndex]
      : undefined;

  // Delete selected row
  const onDelete = () => {
    if (selectedIndex === undefined || props.value === undefined) return;
    props.onChange(props.value.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(undefined);
  };

  // Apply form changes to selected row or new row
  const onApply = (apply: PortRemap) => {
    if (selectedIndex !== undefined && props.value !== undefined) {
      // Replace selected item in the collection
      props.onChange(
        props.value.map((item, i) => (i === selectedIndex ? apply : item)),
      );
    } else {
      // Append new item at the end of the array
      props.onChange([...(props.value || []), apply]);
    }
  };

  return (
    <Stack spacing={2} direction="row">
      <PortRemapTable
        data={props.value}
        selected={selectedIndex}
        setSelected={setSelectedIndex}
      />
      <PortRemapForm delete={onDelete} apply={onApply} item={selectedItem} />
    </Stack>
  );
};
