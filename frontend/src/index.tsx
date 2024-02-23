import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import './index.css';
import { Dashboard } from './pages/Home';
import { Leaderboard } from './pages/Leaderboard';
import { Wall } from './pages/Wall';

import reportWebVitals from './reportWebVitals';

const container: any = document.getElementById('root');
const root = createRoot(container);
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Navigate to="/Dashboard" />} />
			<Route path="/Dashboard" element={<Dashboard />} />
			<Route path="/Leaderboard" element={<Leaderboard />} />
			<Route path="/Wall" element={<Wall />} />
		</Routes>
	</BrowserRouter>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
