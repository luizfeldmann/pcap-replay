import type { InfiniteData } from "@tanstack/react-query";

const pageTransform = <TPage>(
  prevData: InfiniteData<TPage> | undefined,
  cb: (page: TPage, pageIndex: number) => TPage,
): InfiniteData<TPage> | undefined => {
  if (!prevData) return undefined;
  return {
    pageParams: prevData.pageParams,
    pages: prevData.pages.map(cb),
  };
};

type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

const itemsTransform = <TPage, TItem>(
  prevData: InfiniteData<TPage> | undefined,
  itemsKey: KeysOfType<TPage, TItem[]>,
  cb: (items: TItem[], pageIndex: number) => TItem[],
): InfiniteData<TPage> | undefined =>
  pageTransform(prevData, (page, pageIndex) => ({
    ...page,
    [itemsKey]: cb(page[itemsKey] as TItem[], pageIndex),
  }));

export const itemPrepend = <TPage, TItem>(
  prevData: InfiniteData<TPage> | undefined,
  itemsKey: KeysOfType<TPage, TItem[]>,
  item: TItem,
): InfiniteData<TPage> | undefined =>
  itemsTransform<TPage, TItem>(prevData, itemsKey, (list, pageIndex) =>
    pageIndex === 0 ? [item, ...list] : list,
  );

export const itemsFilter = <TPage, TItem>(
  prevData: InfiniteData<TPage> | undefined,
  itemsKey: KeysOfType<TPage, TItem[]>,
  predicate: (item: TItem) => boolean,
): InfiniteData<TPage> | undefined =>
  itemsTransform<TPage, TItem>(prevData, itemsKey, (list) =>
    list.filter((item) => predicate(item)),
  );

export const itemsMap = <TPage, TItem>(
  prevData: InfiniteData<TPage> | undefined,
  itemsKey: KeysOfType<TPage, TItem[]>,
  predicate: (item: TItem) => TItem,
): InfiniteData<TPage> | undefined =>
  itemsTransform<TPage, TItem>(prevData, itemsKey, (list) =>
    list.map((item) => predicate(item)),
  );
