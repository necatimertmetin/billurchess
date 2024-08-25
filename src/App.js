import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { Link } from 'react-router-dom';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const matchesRef = database.ref('matches');
    matchesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const matchList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setMatches(matchList);
      setLoading(false);
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => matchesRef.off();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Satranç Maçları</h1>
      </header>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : matches.length === 0 ? (
        <p>No matches available</p>
      ) : (
        <ul>
          {matches.map(match => (
            <li key={match.id} className="card">
              <Link to={`/match/${match.id}`}>
                <h2>{match.name}</h2>
                <p>{new Date(match.dateRange.start).toLocaleString()} to {new Date(match.dateRange.end).toLocaleString()}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link to="/add-match" className="button">Add New Match</Link>
    </div>
  );
}

export default App;
