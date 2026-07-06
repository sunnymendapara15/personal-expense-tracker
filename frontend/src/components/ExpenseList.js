import React from "react";

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ExpenseList = ({ expenses, loading, onEdit, onDelete }) => (
  <section className="expense-section">
    <div className="list-header">
      <h2>Recent expenses</h2>
    </div>
    {loading ? (
      <p className="placeholder">Loading expenses...</p>
    ) : !expenses.length ? (
      <p className="placeholder">No expenses yet. Add one to see it here.</p>
    ) : (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td>{formatDate(expense.date)}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td className="expense-actions">
                  <button type="button" onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                  <button type="button" className="ghost" onClick={() => onDelete(expense.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default ExpenseList;
