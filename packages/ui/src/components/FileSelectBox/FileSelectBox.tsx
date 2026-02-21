import { Autocomplete, Menu, MenuItem, TextField } from "@mui/material";
import { useFilesList } from "../../api/files/useFilesList";
import { Virtuoso } from "react-virtuoso";
import { Children, forwardRef, useMemo, type FocusEventHandler } from "react";

export const FileSelectBox = (props: {
  label: string;
  error?: string;
  value: string;
  onChange(value?: string): void;
  onBlur: FocusEventHandler<HTMLDivElement>;
}) => {
  // Infinite query for the files
  const { hasNextPage, fetchNextPage, data } = useFilesList();

  // Flatten the pages in a continuous list
  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  // Currently selected item or empty
  const selectedItem = items.find((i) => i.id === props.value) || {
    id: "",
    name: "",
    time: "",
    size: 0,
  };

  // Virtualized list is memoized to avoid remount of virtuoso when value changes
  const VirtualizedList = useMemo(
    () =>
      forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
        ({ children, ...props1 }, ref) => {
          const items = Children.toArray(children);

          return (
            <Virtuoso
              style={{ height: 300 }}
              totalCount={items.length}
              endReached={() => {
                if (hasNextPage) void fetchNextPage();
              }}
              components={{
                List: (props2) => <div ref={ref} {...props1} {...props2} />,
              }}
              itemContent={(index) => items[index]}
            />
          );
        },
      ),
    [fetchNextPage, hasNextPage],
  );

  return (
    <Autocomplete
      sx={{ maxHeight: 300 }}
      options={items}
      getOptionLabel={(o) => o.name}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      value={selectedItem}
      onChange={(_, v) => props.onChange(v?.id)}
      onBlur={props.onBlur}
      disableClearable={true}
      disablePortal={true}
      filterOptions={(x) => x}
      renderInput={(fieldProps) => (
        <TextField
          {...fieldProps}
          label={props.label}
          error={!!props.error}
          helperText={props.error}
        />
      )}
      renderOption={(props, option) => (
        <MenuItem {...props} key={option.id}>
          {option.name}
        </MenuItem>
      )}
      slots={{
        listbox: VirtualizedList,
      }}
    />
  );
};
