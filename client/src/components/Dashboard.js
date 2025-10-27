import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../assets/Dashboard.css";

const features = [
  {
    title: "Smart Surveillance",
    desc: "Enhancing public safety through facial recognition and AI-driven behavioral analysis. Our system identifies known offenders, tracks missing persons, and alerts law enforcement in real-time to prevent crimes before they happen.",
    icon: "🔍",
    link: "/security-detection",
  },
  {
    title: "Violence Detection for Public Safety",
    desc: "Leveraging AI to detect violent behavior in public spaces. Our system analyzes video feeds to identify physical altercations, aggressive gestures, and other potential threats, enabling rapid response by authorities.",
    icon: "👊",
    link: "/violence-detection",
  },
  {
    title: "AI-Powered Traffic Management",
    desc: "Harnessing AI to revolutionize urban mobility. Our smart traffic signals dynamically adjust based on real-time congestion, reducing travel time, minimizing fuel consumption, and improving emergency response efficiency.",
    icon: "🚦",
    link: "/traffic-management",
  }
];

const Dashboard = () => {
  return (
    <Container fluid className="dashboard-container">
      {/* Header */}
      <header className="header">
        <h1 className="fade-in">Smart City Guardian</h1>
        <p className="slogan">"Empowering Cities with AI, One Innovation at a Time"</p>
      </header>

      {/* Feature Sections */}
      <Row className="feature-section justify-content-center">
        {features.map((feature, index) => (
          <Col md={10} lg={8} key={index} className="mb-4">
            <Card className="feature-card">
              <Card.Body>
                <h3 className="feature-icon">{feature.icon}</h3>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Text>{feature.desc}</Card.Text>
                <Button href={feature.link} className="glow-btn">
                  Explore More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
