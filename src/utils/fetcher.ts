const fetcher = async (url: string) => {
  const res = await fetch(url);

  // console.log("Full response:", res);

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }

  return res.json(); // Only parse if successful
};

export default fetcher;
