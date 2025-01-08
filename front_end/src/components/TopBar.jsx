import React, { useState } from 'react';

function TopBar({ shapes, connections, dijkstra, setShortestPath }) {
  const [depart, setDepart] = useState('');
  const [arrive, setArrive] = useState('');

  const handleGoClick = () => {
    if (!depart || !arrive) {
      alert('Please fill in both "Depart" and "Arrive" fields.');
      return;
    }

    // Find the start and end shapes by name
    const startShape = shapes.find(shape => shape.text === depart);
    const endShape = shapes.find(shape => shape.text === arrive);

    if (!startShape || !endShape) {
      alert('Invalid "Depart" or "Arrive" locations.');
      return;
    }

    // Run Dijkstra to find the shortest path
    const path = dijkstra(startShape.id, endShape.id, connections);

    // Set the shortest path
    setShortestPath(path);
  };

  return (
    <div className="top-bar bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <h1 className="text-xl font-semibold">QuickTrack</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          placeholder="Depart"
          className="input input-bordered px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={arrive}
          onChange={(e) => setArrive(e.target.value)}
          placeholder="Arrive"
          className="input input-bordered px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGoClick}
          className="btn btn-primary px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go
        </button>
      </div>
    </div>
  );
}

export default TopBar;
