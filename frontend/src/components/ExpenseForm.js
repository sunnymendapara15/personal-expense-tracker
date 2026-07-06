import React, { useEffect, useMemo, useState } from "react";
import categories from "../constants/categories";

const today = new Date().toISOString().split("T")[0];

const formatDate = (value) => {
  if (!value) {
    return today;
  }
  return value.includes("T") ? value.split("T")[0] : value;
};

const ExpenseForm = ({ mode = "add", expense, onSubmit, onCancel }) => {
  const [formState, setFormState] = useState({
    description: "",
    amount: "",
    category: categories[0],
    date: today,
  });

  useEffect(() => {
    if (expense) {
      setFormState({
        description: expense.description ?? "",
        amount: expense.amount ? expense.amount.toString() : "",
        category: expense.category || categories[0],
        date: formatDate(expense.date),
      });
    } else {
      setFormState({
        description: "",
        amount: "",
        category: categories[0],
        date: today,
      });
    }
  }, [expense]);

  const isValid = useMemo(() => {
    const amount = parseFloat(formState.amount);
    return (
      formState.description.trim().length > 0 &&
      !Number.isNaN(amount) &&
      amount > 0 &&
      formState.date
    );
  }, [formState]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const submitForm = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    onSubmit({
      description: formState.description.trim(),
      amount: parseFloat(formState.amount),
      category: formState.category,
      date: formState.date,
    });
  };

  return (
    <form className="expense-form" onSubmit={submitForm}>
      <div className="form-header">
        <h2>{mode === "edit" ? "Update expense" : "Add expense"}</h2>
        <p className="subtext">Amounts are stored in your local currency.</p>
      </div>
      <label>
        Description
        <input
          type="text"
          value={formState.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="e.g. Monthly groceries"
        />
      </label>
      <label>
        Amount
        <input
          type="number"
          step="0.01"
          min="0"
          value={formState.amount}
          onChange={(event) => handleChange("amount", event.target.value)}
          placeholder="0.00"
        />
      </label>
      <label>
        Category
        <select
          value={formState.category}
          onChange={(event) => handleChange("category", event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input
          type="date"
          value={formState.date}
          onChange={(event) => handleChange("date", event.target.value)}
        />
      </label>
      <div className="form-actions">
        {mode === "edit" && (
          <button type="button" className="ghost secondary" onClick={onCancel}>
            Cancel edits
          </button>
        )}
        <button type="submit" disabled={!isValid}>
          {mode === "edit" ? "Save changes" : "Add expense"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
