export const handleFetch = async (
  endpoint: string,
  setLoading: any,
  onSuccess: any,
  onError: any
) => {
  setLoading(true);
  let response : any = await fetch(`/api` + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  response = await response.json();
  setLoading(false);

  if (response) {
    if (response.success) {
      onSuccess(response.data);
    } else {
      onError(`Error: ${response.message}`);
    }
  } else {
    onError(`Error: Unexpected error occurred`);
  }
};
