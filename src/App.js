import { useState, useEffect } from "react";
import "./App.css";

// Function to generate seats for 10 rows with left and right positions
// Each row has 2 left seats (window and aisle) and 3 right seats (aisle, middle, window)
const generateSeats = () => {
  let seats = [];
  for (let row = 1; row <= 10; row++) {
    seats.push({ id: `L${row}W`, row, position: "left", type: "window", booked: false });
    seats.push({ id: `L${row}A`, row, position: "left", type: "aisle", booked: false });

    seats.push({ id: `R${row}A`, row, position: "right", type: "aisle", booked: false });
    seats.push({ id: `R${row}M`, row, position: "right", type: "middle", booked: false });
    seats.push({ id: `R${row}W`, row, position: "right", type: "window", booked: false });
  }
  return seats;
};

function App() {
  const [seats, setSeats] = useState(generateSeats()); // Initialize seats with 10 rows and their respective positions
  const [selectedSeat, setSelectedSeat] = useState([]); // Array to hold selected seats
  const [nextPrefSeats, setNextPrefSeats] = useState([]); // Array to hold next preferred seats
  const [errorMsg, setErrorMsg] = useState("");

  // If next preferred seats are booked, filter them out
  useEffect( () => {
    setNextPrefSeats( prev => prev.filter(s => s.booked === false) );
  }, [nextPrefSeats] ); 

  const handleSeatClick = (id) => {
    setSelectedSeat(prev =>
      prev.includes(id) ? prev.filter(seat => seat !== id) : [...prev, id]
    );
  };

  // Booking priority:
  // Left: Aisle, Window
  // Right: Aisle, Middle, Window
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

    // Check if all seats are booked
    const allBooked = updatedSeats.every((seat) => seat.booked);
    if (allBooked) {
      setErrorMsg("All seats are already booked!");
      setTimeout(() => {
        setErrorMsg("");
      }, 5000);
      return;
    }

    // Check if selected seats are valid
    if (selectedSeat.length > 0) {
      selectedSeat.forEach( id => {
        const index = updatedSeats.findIndex(s => s.id === id);
        if (index !== -1 && !updatedSeats[index].booked) {
          updatedSeats[index].booked = true;
          setSeats(updatedSeats);
          setSelectedSeat([]);
        }
        // Add adjacent seats to next preferred seats
        const adjacentSeats = updatedSeats.filter(s =>
          (s.row === updatedSeats[index].row &&
            s.position === updatedSeats[index].position) &&
            s.booked === false
        );
        if (adjacentSeats.length > 0) {
          setNextPrefSeats(prev => [...prev, ...adjacentSeats])
        }
      })
    } 
    // If no selected seats, check next preferred seats
    else if (nextPrefSeats.length > 0) {
      const nextSeat = nextPrefSeats.shift();
      if (nextSeat) {
        const index = updatedSeats.findIndex(s => s.id === nextSeat.id);
        if (index !== -1 && !updatedSeats[index].booked) {
          updatedSeats[index].booked = true;
          setSeats(updatedSeats);
          setNextPrefSeats(nextPrefSeats);
        }
      }
      return;
    } 
    // If no selected or next preferred seats, book based on priority
    else {
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
