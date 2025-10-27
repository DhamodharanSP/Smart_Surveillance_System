import React from "react";
import "../assets/Header.css"; // Importing the header styles

const Header = () => {
  return (
    <header className="custom-header py-4 shadow-lg">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="company-logo me-4"
          />
        </div>

        {/* Company Name */}
        <h1 className="company-name">BLACK SQUAD</h1>

        {/* Search Bar (Placeholder for future use) */}
        <div className="d-flex align-items-center search-bar">
          {/* Add search bar input and button here if needed */}
        </div>
      </div>
    </header>
  );
};

export default Header;