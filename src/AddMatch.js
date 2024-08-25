import React, { useState } from 'react';
import { database } from './firebase';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles.css'; // CSS dosyanızı import edin

function AddMatch() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Yükleniyor durumu için state
  const navigate = useNavigate();

  // Kullanıcı adını almak için işlev
  const getCurrentUserName = () => {
    const user = firebase.auth().currentUser;
    return user ? user.displayName || user.email : 'Anonymous'; // Kullanıcı adı yoksa e-posta adresini kullan
  };

  // Tarihleri kontrol eden işlev
  const checkForDateConflict = async () => {
    const matchesRef = database.ref('matches');
    const snapshot = await matchesRef.once('value');
    const data = snapshot.val();
    if (!data) return false;

    for (const key in data) {
      const match = data[key];
      const matchStart = new Date(match.dateRange.start).getTime();
      const matchEnd = new Date(match.dateRange.end).getTime();
      const newStart = new Date(startDate).getTime();
      const newEnd = new Date(endDate).getTime();

      if ((newStart < matchEnd && newEnd > matchStart)) {
        return true; // Tarihler çakışıyor
      }
    }
    return false; // Tarihler çakışmıyor
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !startDate || !endDate) { // Kullanıcı adı gerekmiyor
      setError('All fields are required');
      return;
    }

    setLoading(true);

    const hasConflict = await checkForDateConflict();
    if (hasConflict) {
      setError('A match with the same date range already exists');
      setLoading(false);
      return;
    }

    const matchesRef = database.ref('matches');
    const newMatchRef = matchesRef.push();
    newMatchRef.set({
      name,
      dateRange: {
        start: startDate,
        end: endDate
      },
      userName: getCurrentUserName(), // Mevcut kullanıcı adını ekledik
      status: 'open'
    }).then(() => {
      navigate('/');
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Add New Match</h1>
        {error && <p className="error">Error: {error}</p>}
        {loading && <p>Loading...</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button type="submit" className="button" disabled={loading}>Add Match</button>
        </form>
      </div>
    </div>
  );
}

export default AddMatch;
