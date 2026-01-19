import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Recorder from "./components/Buttons/Recorder";
import Loader from "./components/Loader.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { SidebarDemo } from "./components/Sidebar";
import Dashboard from "./pages/Dashboards/Dashboard";

function App() {
	const [showLoader, setShowLoader] = useState(true);

	if (showLoader) {
		return <Loader onComplete={() => setShowLoader(false)} />;
	}
	return <h1>INDEX PAGE</h1>;
}

export default App;
