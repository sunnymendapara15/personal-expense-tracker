import React from "react";

const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function ExpenseList({ expenses = [] }) {
  if (!expenses.length) {
    return <p className="empty-state">No expenses match the current filters.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <li key={expense.id} className="expense-item">
          <div>
            <p className="expense-description">{expense.description}</p>
            <p className="expense-meta">
              {expense.category} · {formatDate(expense.date)}
            </p>
          </div>
          <p className="expense-amount">${Number(expense.amount).toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
