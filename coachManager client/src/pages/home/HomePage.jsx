import './home.css';

const HomePage = () => {
  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">CoachManager</h1>
        <p className="home__tagline">Homepage — step 1 (routes de test)</p>
      </header>
      <main className="home__main">
        <p className="home__text">
          Si vous voyez cette page sur, le routage fonctionne.
        </p>
      </main>
    </div>
  );
};

export default HomePage;
