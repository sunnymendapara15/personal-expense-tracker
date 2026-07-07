import React, { useEffect, useMemo, useState } from "react";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseForm from "./components/ExpenseForm";
import { fetchExpenses, createExpense } from "./services/api";
import "./App.css";

const STORAGE_KEY = "personal-expense-tracter.expenses";
const categories = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Utilities",
  "Health",
  "Entertainment",
  "Other"
];

const blankFilters = () => ({ category: "", startDate: "", endDate: "" });

const loadFromStorage = () => {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveToStorage = (payload) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

const sortByDateDesc = (items) =>
  [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function App() {
  const [expenses, setExpenses] = useState(() => sortByDateDesc(loadFromStorage()));
  const [filters, setFilters] = useState(blankFilters());
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const synchronize = async () => {
      setLoading(true);
      try {
        const data = await fetchExpenses();
        if (Array.isArray(data) && data.length) {
          const sorted = sortByDateDesc(data);
          setExpenses(sorted);
          saveToStorage(sorted);
          setStatus("Synced with server.");
        } else if (Array.isArray(data)) {
          setExpenses([]);
          saveToStorage([]);
          setStatus("No expenses recorded yet.");
        }
      } catch (error) {
        setStatus("Offline mode: using saved expenses.");
      } finally {
        setLoading(false);
      }
    };

    synchronize();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      if (filters.category && expense.category !== filters.category) {
        return false;
      }
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        const expenseDate = new Date(expense.date);
        if (expenseDate < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        const expenseDate = new Date(expense.date);
        if (expenseDate > end) return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [filteredExpenses]);

  const handleAddExpense = async (payload) => {
    const provisionalId = `local-${Date.now()}`;
    const provisionalExpense = {
      ...payload,
      id: provisionalId,
      created_at: new Date().toISOString(),
    };

    const updated = sortByDateDesc([provisionalExpense, ...expenses]);
    setExpenses(updated);
    saveToStorage(updated);
    setStatus("Saving locally...");

    try {
      const persisted = await createExpense(payload);
      if (persisted && persisted.id) {
        const merged = updated.map((item) =>
          item.id === provisionalId ? { ...item, ...persisted } : item
        );
        const sorted = sortByDateDesc(merged);
        setExpenses(sorted);
        saveToStorage(sorted);
        setStatus("Expense saved.");
      }
    } catch (error) {
      setStatus("Stored locally; could not sync with server.");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters(blankFilters());
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Daily balance · simple journal</p>
          <h1>Personal Expense Tracker</h1>
          <p className="lead">
            Add, filter, and review your expenses with a clean, responsive interface. Data saves to your
            device whether or not the API is reachable.
          </p>
        </div>
        <div className="status-chip">{loading ? "Syncing…" : status}</div>
      </header>

      <section className="stats-row">
        <article>
          <p className="label">Total spending</p>
          <p className="value">${totalSpent.toFixed(2)}</p>
          <p className="subtext">{filteredExpenses.length} {filteredExpenses.length === 1 ? "entry" : "entries"} shown</p>
        </article>
        <article>
          <p className="label">Data source</p>
          <p className="value">{expenses.length ? "LocalStorage" : "—"}</p>
          <p className="subtext">FastAPI ready; syncing on save</p>
        </article>
      </section>

      <section className="filters-card">
        <div className="filters-header">
          <h2>Filters</h2>
          <button type="button" className="ghost" onClick={handleClearFilters}>
            Reset
          </button>
        </div>
        <ExpenseForm filters={filters} categories={categories} onChange={handleFilterChange} />
      </section>

      <section className="content-grid">
        <div className="panel">
          <ExpenseForm categories={categories} onSubmit={handleAddExpense} />
        </div>
        <div className="panel">
          <ExpenseList expenses={filteredExpenses} />
        </div>
      </section>
    </div>
  );
}

export default App;
