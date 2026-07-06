const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const readError = async (response) => {
  let detail = response.statusText;
  try {
    const payload = await response.json();
    if (payload) {
      detail = payload.detail ?? payload.message ?? detail;
    }
  } catch (error) {
    // ignore parsing errors
  }
  return detail;
};

const handleJsonResponse = async (response) => {
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const handleVoidResponse = async (response) => {
  if (!response.ok) {
    throw new Error(await readError(response));
  }
};

const buildUrl = (path, params = {}) => {
  const normalizedBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const url = new URL(`${normalizedBase}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

export const fetchExpenses = async (filters = {}) => {
  const url = buildUrl("/expenses/", filters);
  return handleJsonResponse(await fetch(url));
};

export const createExpense = async (payload) =>
  handleJsonResponse(
    await fetch(buildUrl("/expenses/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );

export const updateExpense = async (expenseId, payload) =>
  handleJsonResponse(
    await fetch(buildUrl(`/expenses/${expenseId}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );

export const deleteExpense = async (expenseId) =>
  handleVoidResponse(
    await fetch(buildUrl(`/expenses/${expenseId}`), {
      method: "DELETE",
    })
  );

export const getMonthlySummary = async () =>
  handleJsonResponse(await fetch(buildUrl("/summary/monthly")));

export const getCategorySummary = async () =>
  handleJsonResponse(await fetch(buildUrl("/summary/category")));
