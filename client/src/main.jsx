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
import NotesDashboard from "./pages/Dashboards/NotesDashboard.jsx";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SingupPage from "./pages/Auth/SingupPage.jsx";
import Dashboard from "./pages/Dashboards/Dashboard.jsx";
import SidebarLayout from "./pages/SidebarLayout.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {AuthProvider} from "./hooks/AuthContext.jsx";
import PublicOnlyRoute from "./routes/PublicOnlyRoute.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path="/"
				element={
						<Home />
				}
			/>
			{/* <Route element = {ProtectedRoute} > */}
				<Route
				path="/dashboard"
				element={
					<SidebarLayout>
						<Dashboard />
					</SidebarLayout>
				}
			/>

			{/* <Route element = {ProtectedRoute} > */}
				<Route
				path="/notes"
				element={
					<SidebarLayout>
						<NotesDashboard />
					</SidebarLayout>
				}
			/>


			{/* </Route> */}
			<Route path="/login" element={
				<PublicOnlyRoute>
					<LoginPage />
				</PublicOnlyRoute>
			} />
			<Route path="/signup" element={
				<PublicOnlyRoute>
					<SingupPage />
				</PublicOnlyRoute>
			} />
		</>,
	),
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
);
