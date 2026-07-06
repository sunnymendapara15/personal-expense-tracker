import React, { useCallback, useEffect, useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryCard from "./components/SummaryCard";
import CategoryChart from "./components/CategoryChart";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getCategorySummary,
} from "./services/api";
import categories from "./constants/categories";
import "./App.css";

const blankFilters = () => ({ category: "", startDate: "", endDate: "" });

function App() {
  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [filters, setFilters] = useState(blankFilters());
  const [filterDraft, setFilterDraft] = useState(blankFilters());
  const [mode, setMode] = useState("add");
  const [activeExpense, setActiveExpense] = useState(null);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchExpenses(filters);
      setExpenses(data);
    } catch (error) {
      setStatusMessage("Unable to load expenses at the moment.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadSummaries = useCallback(async () => {
    try {
      const [monthly, categoriesData] = await Promise.all([
        getMonthlySummary(),
        getCategorySummary(),
      ]);
      setMonthlySummary(monthly);
      setCategorySummary(categoriesData);
    } catch (error) {
      setStatusMessage("Unable to load dashboard data.");
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  const refreshAll = async () => {
    await Promise.all([loadExpenses(), loadSummaries()]);
  };

  const handleSubmit = async (payload) => {
    try {
      setStatusMessage("");
      if (mode === "edit" && activeExpense) {
        await updateExpense(activeExpense.id, payload);
        setStatusMessage("Expense updated.");
      } else {
        await createExpense(payload);
        setStatusMessage("Expense recorded.");
      }
      setMode("add");
      setActiveExpense(null);
      await refreshAll();
    } catch (error) {
      setStatusMessage(error.message || "Saving failed.");
    }
  };

  const handleEdit = (expense) => {
    setActiveExpense(expense);
    setMode("edit");
    setStatusMessage("");
  };

  const handleDelete = async (expenseId) => {
    const confirmed = window.confirm("Delete this expense?");
    if (!confirmed) {
      return;
    }
    try {
      await deleteExpense(expenseId);
      setStatusMessage("Expense removed.");
      await refreshAll();
    } catch (error) {
      setStatusMessage("Unable to delete the expense.");
    }
  };

  const handleCancel = () => {
    setActiveExpense(null);
    setMode("add");
  };

  const handleFilterInput = (field, value) => {
    setFilterDraft((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setFilters({ ...filterDraft });
  };

  const clearFilters = () => {
    const reset = blankFilters();
    setFilterDraft(reset);
    setFilters(reset);
  };

  const monthlyHighlight = monthlySummary.length
    ? monthlySummary[monthlySummary.length - 1]
    : null;

  const totalRecorded = useMemo(
    () => categorySummary.reduce((sum, item) => sum + item.total, 0),
    [categorySummary]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Personal Expense Tracker</h1>
          <p>Capture every spend and get instant insights.</p>
        </div>
      </header>

      <section className="summary-row">
        <SummaryCard
          label="Latest month"
          value={
            monthlyHighlight ? `$${monthlyHighlight.total.toFixed(2)}` : "—"
          }
          subtext={monthlyHighlight ? monthlyHighlight.month : "Awaiting data"}
        />
        <SummaryCard
          label="Total recorded"
          value={`$${totalRecorded.toFixed(2)}`}
          subtext={`${expenses.length} entries`}
        />
      </section>

      <section className="filters-panel">
        <div className="filters-header">
          <h2>Filters</h2>
          <div className="filter-buttons">
            <button type="button" onClick={applyFilters}>
              Apply Filters
            </button>
            <button type="button" className="ghost" onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>
        <div className="filters-grid">
          <label>
            Category
            <select
              value={filterDraft.category}
              onChange={(event) => handleFilterInput("category", event.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label>
            Start date
            <input
              type="date"
              value={filterDraft.startDate}
              onChange={(event) => handleFilterInput("startDate", event.target.value)}
            />
          </label>
          <label>
            End date
            <input
              type="date"
              value={filterDraft.endDate}
              onChange={(event) => handleFilterInput("endDate", event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="main-panels">
        <div className="form-panel">
          <ExpenseForm mode={mode} expense={activeExpense} onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
        <div className="chart-panel">
          <CategoryChart data={categorySummary} />
          <div className="divider" aria-hidden="true" />
          <ExpenseList expenses={expenses} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </section>

      {statusMessage && <p className="status">{statusMessage}</p>}
    </div>
  );
}

export default App;
