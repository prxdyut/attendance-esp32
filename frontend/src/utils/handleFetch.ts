export const handleFetch = async (
  endpoint: string,
  setLoading: any,
  onSuccess: any,
  onError: any
) => {
  setLoading(true);
  let response : any = await fetch(`http://${process.env.BACKEND_URL || "http://localhost:3000" }/api` + endpoint, {
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
