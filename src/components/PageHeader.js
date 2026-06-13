import React from "react";

const PageHeader = ({ title, subtitle }) => (
  <div className="page-header">
    <div className="page-header__inner">
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </div>
  </div>
);

export default PageHeader;
