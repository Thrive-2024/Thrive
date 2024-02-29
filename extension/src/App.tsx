import './App.css';
import React, { useState } from 'react';
import Pomodoro from './popup/Pomodoro';

function App() {

  return (
    <div>
      <head>
        <script src="https://cdn.tailwind.com"></script>
      </head>

      <body>
        <div className="tab-section bg-gray-100 rounded-lg p-5 border-2 border-indigo-200">
          <div className="flex flex-wrap gap-1">
            <button className="p-4 rounded-lg text-gray-700 font-bold" data-tab-target="#tab1">Profile</button>
            <button className="p-4 rounded-lg text-gray-700 font-bold" data-tab-target="#tab1">Profile</button>
            <button className="p-4 rounded-lg text-gray-700 font-bold" data-tab-target="#tab1">Profile</button>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;

