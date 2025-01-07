import React from 'react'

function TopBar({ currentPage, setCurrentPage }) {
  return (
    <div className="top-bar">
      <h1 className="text-xl font-semibold">QuickTrack</h1>
      <div className="flex items-center space-x-4">
        <button 
          className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentPage(1)}
        >
          Page 1
        </button>
        <button 
          className={`btn ${currentPage === 2 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentPage(2)}
        >
          Page 2
        </button>
      </div>
    </div>
  )
}

export default TopBar

