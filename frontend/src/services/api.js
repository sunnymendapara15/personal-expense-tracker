const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/$/, "");

const readError = async (response) => {
  let error = response.statusText;
  const text = await response.text();
  if (text) {
    try {
      const payload = JSON.parse(text);
      error = payload.detail || payload.message || error;
    } catch (err) {
      // use default
    }
  }
  return error;
};

const handleResponse = async (responsePromise) => {
  const response = await responsePromise;
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const fetchExpenses = () => handleResponse(fetch(`${API_BASE}/expenses/`));

export const createExpense = (payload) =>
  handleResponse(
    fetch(`${API_BASE}/expenses/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );

