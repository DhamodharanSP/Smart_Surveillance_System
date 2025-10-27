import React from "react";
import { Container } from "react-bootstrap";
import "../assets/Footer.css"; // Importing the footer styles

const Footer = () => {
  return (
    <footer className="custom-footer py-4 mt-5">
      <Container className="text-center">
        <small className="footer-text">
          &copy; {new Date().getFullYear()} <strong>Black Squad</strong> | Pioneering the Future
        </small>
      </Container>
    </footer>
  );
};

export default Footer;
