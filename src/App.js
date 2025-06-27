import React, { useState } from "react";
import "./App.css";

const generateSeats = () => {
  let seats = [];
  for (let row = 1; row <= 10; row++) {
    // Left side: Window (B), Aisle (A)
    seats.push({ id: `L${row}B`, row, position: "left", type: "window", booked: false });
    seats.push({ id: `L${row}A`, row, position: "left", type: "aisle", booked: false });

    // Right side: Aisle (A), Middle (B), Window (C)
    seats.push({ id: `R${row}A`, row, position: "right", type: "aisle", booked: false });
    seats.push({ id: `R${row}B`, row, position: "right", type: "middle", booked: false });
    seats.push({ id: `R${row}C`, row, position: "right", type: "window", booked: false });
  }
  return seats;
};

function App() {
  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSeatClick = (id) => {
    setSelectedSeat(prev =>
      prev.includes(id) ? prev.filter(seat => seat !== id) : [...prev, id]
    );
  };

  const bookingPriority = [
    { position: "left", type: "aisle" },
    { position: "right", type: "aisle" },
    { position: "right", type: "middle" },
    { position: "left", type: "window" },
    { position: "right", type: "window" },
  ];

  const handleBook = () => {
    let updatedSeats = [...seats];
    setErrorMsg("");

    const allBooked = updatedSeats.every((seat) => seat.booked);
    if (allBooked) {
      setErrorMsg("All seats are already booked!");
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return;
    }

    if (selectedSeat.length > 0) {
      selectedSeat.forEach( id => {
        const index = updatedSeats.findIndex(s => s.id === id);
        if (index !== -1 && !updatedSeats[index].booked) {
          updatedSeats[index].booked = true;
          setSeats(updatedSeats)
        }
      })
    } else {
      for (let pref of bookingPriority) {
        for (let i = 0; i < updatedSeats.length; i++) {
          const seat = updatedSeats[i];
          if (!seat.booked && seat.position === pref.position && seat.type === pref.type) {
            updatedSeats[i].booked = true;
            setSeats(updatedSeats);
            return;
          }
        }
      }
    }

    setSelectedSeat([]);
  };

  return (
    <>
      <h1>Booking App</h1>
      <div className="container">
        <h2>Seat Selecting</h2>
        <div className="rows">
          {[...Array(10)].map((_, rowIndex) => (
            <div key={rowIndex} className="row">
              {/* Left: Window + Aisle */}
              {seats
                .filter((s) => s.row === rowIndex + 1 && s.position === "left")
                .map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${seat.booked ? "booked" : ""} ${selectedSeat.includes(seat.id) ? "selected" : ""}`}
                    onClick={() => !seat.booked && handleSeatClick(seat.id)}
                  >
                    {seat.id}
                  </div>
                ))}

              <div className="aisle-space" />

              {/* Right: Aisle + Middle + Window */}
              {seats
                .filter((s) => s.row === rowIndex + 1 && s.position === "right")
                .map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${seat.booked ? "booked" : ""} ${selectedSeat.includes(seat.id) ? "selected" : ""}`}
                    onClick={() => !seat.booked && handleSeatClick(seat.id)}
                  >
                    {seat.id}
                  </div>
                ))}
            </div>
          ))}
        </div>
        <div className="error-btn-container">
          {errorMsg && <p className="error">{errorMsg}</p>}
          <button onClick={handleBook}>Book</button>
        </div>
      </div>
      <div className="info">
        <p>Available seats</p>
        <p>Selected seats</p>
        <p>Booked seats</p>
      </div>
    </>
  );
}

export default App;
