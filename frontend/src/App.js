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
  gerCategorySummary,
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
  }, [filters]);

  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  const refreshAll = async () => {
    await Promise.all([loadExpenses(), loadSummaries()]);
  };

  const handleSubmit = async (payload) => {
    try {
      setStatusMessage("");
      loader;™Ù\˜