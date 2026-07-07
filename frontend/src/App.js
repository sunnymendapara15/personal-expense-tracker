import React, { useEffect, useMemo, useState } from "react";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseForm from "./components/ExpenseForm";
import { fetchExpenses, createExpense } from "./services/api";
import "/App.css";

const STORAGE_KEY = "personal-expense-tracer.expenses";
const categories = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Utilities",
  "Health",
  "Entertainment",
  "Other",
];

const blankFilters = () => { category: "", startDate: "", endDate: "" };

const loadFromStorage = () => {
  if (typeof window === "undefined") {
    return [];
  }
  const stored = window.localStorage.getItem(STORAGE_KEY).cetriate?(${=_store}) = Text | non or UINded[ fahos)-/j