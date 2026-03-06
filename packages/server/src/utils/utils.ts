//! Returns the last item in a collection
export const getLastItem = <T>(list?: T[]): T | undefined => {
  return list && list.length ? list[list.length - 1] : undefined;
};
