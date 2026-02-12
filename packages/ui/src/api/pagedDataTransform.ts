import type { InfiniteData } from "@tanstack/react-query";

const pageTransform = <TPage>(
  prevData: InfiniteData<TPage> | undefined,
  cb: (page: TPage) => TPage,
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
  cb: (items: TItem[]) => TItem[],
): InfiniteData<TPage> | undefined =>
  pageTransform(prevData, (page) => ({
    ...page,
    [itemsKey]: cb(page[itemsKey] as TItem[]),
  }));

export const itemsFilter = <TPage, TItem>(
  prevData: InfiniteData<TPage> | undefined,
  itemsKey: KeysOfType<TPage, TItem[]>,
  predicate: (item: TItem) => boolean,
): InfiniteData<TPage> | undefined =>
  itemsTransform<TPage, TItem>(prevData, itemsKey, (list) =>
    list.filter((item) => predicate(item)),
  );
