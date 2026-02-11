export const getQueryParams = (url: string) => {
  const queryParams: Record<string, string> = {};
  new URL(url).searchParams.forEach((v, k) => {
    queryParams[k] = v;
  });

  return queryParams;
};
