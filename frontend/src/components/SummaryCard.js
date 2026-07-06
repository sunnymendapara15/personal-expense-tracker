import React from "react";

const SummaryCard = ({ label, value, subtext }) => (
  <article className="summary-card">
    <p className="summary-label">{label}</p>
    <p className="summary-value">{value}</p>
    {subtext && <p className="summary-subtext">{subtext}</p>}
  </article>
);

export default SummaryCard;
