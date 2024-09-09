export const handleFetch = async (
  endpoint: string,
  setLoading: any,
  onSuccess: any,
  onError: any,
  options?: {
    pagination: {
      current: number;
      rows: number;
      set: React.Dispatch<
        React.SetStateAction<{
          current: number;
          total: number;
          rows: number;
          count: number;
        }>
      >;
    };
  }
) => {
  let url = new URL(location.origin + `/api` + endpoint);
  let searchParams = url.searchParams;
  if (options?.pagination) {
    searchParams.set("page", String(options.pagination.current));
    searchParams.set("rows", String(options.pagination.rows));
  }

  setLoading(true);
  let response: any = await fetch(
    url.origin + url.pathname + "?" + searchParams.toString(),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  response = await response.json();
  setLoading(false);                

  if (response) {
    if (response.success) {
      onSuccess(response.data);
      if (options?.pagination && response?.pagination) {
        options?.pagination.set(response.pagination);
      }
      console.log(response)
    } else {
      onError(`Error: ${response.message}`);
    }
  } else {
    onError(`Error: Unexpected error occurred`);
  }
};
