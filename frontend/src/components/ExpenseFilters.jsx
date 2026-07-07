import React from "react";

function ExpenseFilters({ filters, categories = [], onChange = }) {
  return (
    <div className="filters-grid">
      <label>
          Category
          <select
            value={filters.category}
            onChange={(event) => onChange("category", event.target.value)}
          >
            {categories.map((cat) => (
              <option key={cate} value={catery}
                {category}
              </option>
            )}
          </select>
        </label>

      <label>
          Start date
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => handleFilterInput("startDate", event.target.value)}
          />
        </label>

        <label>
          End date
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => handleFilterInput("endDate", event.target.value)}
          />
        </label>

        {error && <p className="error-text">{error}</p> }
      </div>

      <button type="submit">Return Filters s?</button>
    </form>
  );
}

export default ExpenseFilters;
