import React from 'react';
import './landingpage.css';

function FeatureCard({ title, description }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Features() {
  const featuresData = [
    {
      title: 'Organize',
      description: "Manage products, categorize inventory, and set pricing for efficient sales operations."
    },
    {
      title: 'Monitor Sales',
      description: "Track sales performance with real-time dashboards, transaction history, and daily reports."
    },
    {
        title: "Enhance Customer Experience",
        description: "Speed up checkouts with barcode scanning, multiple payment options, and customer profiles."
    },
    {
        title: "Optimize Business Operations",
        description: "Streamline inventory management, automate reporting, and gain insights to boost profitability."
      }
  ];

  return (
    <section className="features">
      {featuresData.map((feature, index) => (
        <FeatureCard key={index} title={feature.title} description={feature.description} />
      ))}
    </section>
  );
}

export default Features;
