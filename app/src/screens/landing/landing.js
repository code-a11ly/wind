import React from "react";
import "./landing.css"; // Import the external CSS file

export default function Landing() {
  return (
    <div className="header-container">
      <div className="header-content">
        <div aria-hidden="true" className="header-gradient-top" />
        <div className="header-text">
          <div className="announcement">
            Announcing our next round of funding.{' '}
            <a href="#" className="announcement-link">
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          {/*
          <h1 className="header-title">Impulsionando o Seu negócio com soluções Inovadoras!</h1>
          <p className="header-description">
            O posicionamento digital que a sua empresa merece nós te ajudamos a criar.
          </p>
          */}
          <h1 className="header-title">Impulsionando o Seu negócio com soluções Inovadoras!</h1>
          <p className="header-description">
            O POSICIONAMENTO DIGITAL QUE A SUA EMPRESA MERECE,<br/> NÓS TE AJUDAMOS A CRIAR.
          </p>
          <div className="header-buttons">
            <a href="#" className="btn-primary">Get started</a>
            <a href="#" className="btn-secondary">Learn more →</a>
          </div>
        </div>
        <div aria-hidden="true" className="header-gradient-bottom" />
      </div>
    </div>
  );
}
