
export async function fetchJson({ url, method = "GET", body = {} }) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    // TODO: Check if any error handling is needed
    throw error;
  }
}