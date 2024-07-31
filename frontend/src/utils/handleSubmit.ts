import React from "react";

export const handleSubmit = async (
  event: React.FormEvent | undefined,
  endpoint: string,
  setLoading: any,
  onSuccess: any,
  onError: any
) => {
  event?.preventDefault();
  setLoading(true);

  const formData = new FormData(event?.target as HTMLFormElement);
  const body: any = {};
  formData.forEach((value, key) => {
    const data = formData.getAll(key);
    body[key] = data.length == 1 ? data[0] : data;
  });

  const response = await fetch(
    `/api` +
      endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  ).then((res) => res.json());

  setLoading(false);
  console.log(response);
  if (response.success) {
    console.log("Submitted successfully");
    onSuccess(response.data);
  } else if (response.message) {
    console.log(`Error: ${response.message}`);
    onError(`Error: ${response.message}`);
  } else {
    console.log(`Error: Unexpected error occurred`);
    onError(`Error: Unexpected error occurred`);
  }
};
