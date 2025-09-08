import React from 'react'

const Test = () => {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-screen">
      {/* Left side (fixed, full height, no scroll) */}
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold">Sidebar</h2>
        <p>This side is fixed and always fills 100vh.</p>
      </div>

      {/* Right side (scrollable content) */}
      <div className="overflow-y-auto p-6 bg-gray-100">
        <h2 className="text-xl font-bold">Content</h2>
        <p>
          This content area will scroll if it’s taller than the screen, 
          while the sidebar stays fixed.
        </p>

        {/* Just to demo scrolling */}
        <div className="mt-6 space-y-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="p-4 bg-white shadow rounded">
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Test