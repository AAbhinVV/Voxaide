import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import Layout from "./components/Layout/Layout.jsx";
import NotesDashboard from "./pages/Dashboards/NotesDashboard.jsx";
import Home from "./pages/Home.jsx";
import store from "./store/store.js";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SingupPage from "./pages/Auth/SingupPage.jsx";
import Dashboard from "./pages/Dashboards/Dashboard.jsx";
import SidebarLayout from "./pages/SidebarLayout.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={
			<SidebarLayout>
				<Dashboard />
			</SidebarLayout>
		}>
			{/* <Route index element = {<VoxaideDashboard />} /> */}
		{/* <Route path = "login" element = {<Login />} />
      	<Route path = "signup" element = {<Register />} />  */}
		{/* <Route path="notes" element={<VoxaideDashboard />} /> */}
			{/* <Route path  = "notes/:id" element = {<NotesDashboard />} /> */}
		</Route>,	
	),
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store} className="bg-bg-app">
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
);
