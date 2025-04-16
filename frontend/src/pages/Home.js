import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import global styles

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Тавтай морилно уу!</h1>
      <p className="home-description">Энэ бол артист буудлын вэб хуудас юм.</p>

      {/* Navigation Links */}
      <div style={{ marginTop: '30px' }}>
        <Link to="/artists" className="home-button">
          Артистууд
        </Link>
        <Link to="/place-order" className="home-button">
          Захиалах
        </Link>
      </div>
    </div>
  );
};

export default Home;