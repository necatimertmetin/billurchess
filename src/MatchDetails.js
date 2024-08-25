import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import './styles.css'; // CSS dosyanızı import edin

function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Kullanıcı e-posta adresini almak
    const user = firebase.auth().currentUser;
    setUserEmail(user ? user.email : 'Anonymous'); // Eğer oturum açmamışsa anonim olarak göster

    const matchRef = database.ref(`matches/${id}`);
    matchRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setMatch(data);
    }, (error) => {
      setError(error.message);
    });

    return () => matchRef.off();
  }, [id]);

  const handleJoin = () => {
    if (!participantName) {
      setError('Please enter your name');
      return;
    }
    
    if (match.participant && match.participant.email === userEmail) {
      setError('You are already participating in this match');
      return;
    }

    if (match.participant) {
      setError('This match already has a participant');
      return;
    }

    setJoining(true);
    const joinedRef = database.ref(`matches/${id}/participant`);
    joinedRef.set({
      email: userEmail,
      name: participantName
    }).then(() => {
      setJoining(false);
    }).catch((error) => {
      setError(error.message);
      setJoining(false);
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Match Details</h1>
        {error && <p className="error">Error: {error}</p>}
        {match ? (
          <div>
            <h2>{match.name}</h2>
            <p>Start Date: {new Date(match.dateRange.start).toLocaleString()}</p>
            <p>End Date: {new Date(match.dateRange.end).toLocaleString()}</p>
            <p>Status: {match.status}</p>
            <p>Participant: {match.participant ? match.participant.name : 'No participants yet'}</p>
            {match.status === 'open' && (
              <>
                <input 
                  type="text" 
                  value={participantName} 
                  onChange={(e) => setParticipantName(e.target.value)} 
                  placeholder="Enter your name" 
                />
                <button onClick={handleJoin} disabled={joining}>
                  {joining ? 'Joining...' : 'Join Match'}
                </button>
              </>
            )}
          </div>
        ) : (
          <p>Loading match details...</p>
        )}
      </div>
    </div>
  );
}

export default MatchDetails;
