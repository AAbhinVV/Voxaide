import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

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
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SingupPage from "./pages/Auth/SingupPage.jsx";
import Dashboard from "./pages/Dashboards/Dashboard.jsx";
import SidebarLayout from "./pages/SidebarLayout.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path="/"
				element={
					<SidebarLayout>
						<Dashboard />
					</SidebarLayout>
				}
			/>
			<Route element = {ProtectedRoute} >
				<Route
				path="/dashboard"
				element={
					<SidebarLayout>
						<Dashboard />
					</SidebarLayout>
				}
			/>
			</Route>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/signup" element={<SingupPage />} />
		</>,
	),
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
