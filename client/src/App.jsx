import { useState } from "react";

import "./App.css";

import Recorder from "./components/Buttons/Recorder";
import Loader from "./components/Loader.jsx";


function App() {
	const [showLoader, setShowLoader] = useState(true);

	if (showLoader) {
		return <Loader onComplete={() => setShowLoader(false)} />;
	}
	return <h1>INDEX PAGE</h1>;
}

export default App;
