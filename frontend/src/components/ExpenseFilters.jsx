import React from "react";

function ExpenseFilters({ filters, categories = [], onChange = () => {} }) {
  return (
    <div className="filters-grid">
      <label>
        Category
        <select
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Start date
        <input
          type="date"
          value={filters.startDate}
          onChange={(event) => onChange("startDate", event.target.value)}
        />
      </label>

      <label>
        End date
        <input
          type="date"
          value={filters.endDate}
          onChange={(event) => onChange("endDate", event.target.value)}
        />
      </label>
    </div>
  );
}

export default ExpenseFilters;
