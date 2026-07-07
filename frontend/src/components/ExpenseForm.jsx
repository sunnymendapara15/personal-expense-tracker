import React, { useState } from "react";

const initialForm = (defaultCategory) => ({
  description: "",
  amount: "",
  category: defaultCategory,
  date: "",
});

function ExpenseForm({ categories = [], onSubmit }) {
  const [form, setForm] = useState(initialForm(categories[0] || ""));
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.description.trim() || !form.amount || !form.date) {
      setError("Description, amount, and date are required.");
      return;
    }

    const payload = {
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category || categories[0] || "Other",
      date: form.date,
    };

    onSubmit(payload);
    setForm(initialForm(categories[0] || ""));
    setError("");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Add expense</h2>
        <p className="subtext">Log every spend with essential details.</p>
      </div>

      <label>
        Description
        <input
          type="text"
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Coffee, taxi, or groceries"
        />
      </label>

      <label>
        Amount
        <input
          type="number"
          value={form.amount}
          min="0"
          step="0.01"
          onChange={handleChange("amount")}
          placeholder="25.00"
        />
      </label>

      <label>
        Date
        <input type="date" value={form.date} onChange={handleChange("date")} />
      </label>

      <label>
        Category
        <select value={form.category} onChange={handleChange("category")}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit">Save expense</button>
    </form>
  );
}

export default ExpenseForm;
