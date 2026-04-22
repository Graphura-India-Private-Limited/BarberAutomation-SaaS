
import React, { useState, useEffect } from "react";
import "./App.css";

const AVG_SERVICE_TIME = 6;

function App() {
  const [queue, setQueue] = useState([]);
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");

  // Join Queue
  const joinQueue = () => {
    if (!name.trim()) {
      alert("Enter your name");
      return;
    }

    const exists = queue.some(
      (q) => q.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("User already in queue!");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      joinTime: new Date()
    };

    setQueue((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setName("");
    setMessage("You joined the queue!");
  };

  // Simulate queue movement
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prevQueue) => {
        if (prevQueue.length === 0) return prevQueue;

        const removed = prevQueue[0];
        const updated = prevQueue.slice(1);

        // If YOU got served
        if (currentUser && removed.id === currentUser.id) {
          setCurrentUser(null);
          setMessage("🎉 Your turn is done!");
        } else {
          setMessage("Queue moved forward");
        }

        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Get position
  const getPosition = () => {
    if (!currentUser) return null;
    const index = queue.findIndex((q) => q.id === currentUser.id);
    return index >= 0 ? index + 1 : null;
  };

  const position = getPosition();
  const waitTime = position ? (position - 1) * AVG_SERVICE_TIME : 0;

  return (
    <div className="container">
      <h1>Smart Queue System</h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={joinQueue}>Join Queue</button>

      {/* Live Queue View */}
      <div className="card">
        <h2>Live Queue</h2>
        <p>Total People: {queue.length}</p>

        {position ? (
          <>
            <p>
              You are <b>{position}</b> in queue
            </p>
            <p>Approx wait: {waitTime} mins</p>
          </>
        ) : (
          <p>You are not in queue</p>
        )}
      </div>

      {/* Status Message */}
      {message && <p style={{ color: "blue" }}>{message}</p>}

      {/* Queue List */}
      <div className="card">
        <h3>Queue List</h3>
        {queue.map((q, index) => (
          <p
            key={q.id}
            // style={{
            //   color:
            //     currentUser && q.id === currentUser.id
            //       ? "green"
            //       : "black",
            //   fontWeight:
            //     currentUser && q.id === currentUser.id
            //       ? "bold"
            //       : "normal"
            // }}
            className={
              currentUser && q.id ===currentUser.id ? "highlight" : ""
            }
          >
            {index + 1}. {q.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;