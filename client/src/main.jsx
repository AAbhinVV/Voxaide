import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotesDashboard from "./pages/Dashboards/NotesDashboard.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SingupPage from "./pages/Auth/SingupPage.jsx";
import Dashboard from "./pages/Dashboards/Dashboard.jsx";
import SidebarLayout from "./pages/SidebarLayout.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider, ThemeProvider, AudioProvider } from "./hooks/exports.js"
import PublicOnlyRoute from "./routes/PublicOnlyRoute.jsx";
import Verify from "./pages/Verify.jsx";
import RecordingsList from "./pages/Recordings/RecordingsList.jsx";
import VoiceNoteDetail from "./pages/Recordings/VoiceNoteDetail.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import QueryChat from "./pages/Query/QueryChat.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route
				path="/"
				element={
						<Home />
				}
			/>
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<Dashboard />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>

			<Route
				path="/notes"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<NotesDashboard />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<UserProfile />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/settings"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<Settings />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/recordings"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<RecordingsList />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/recordings/:id"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<VoiceNoteDetail />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/query"
				element={
					<ProtectedRoute>
						<SidebarLayout>
							<QueryChat />
						</SidebarLayout>
					</ProtectedRoute>
				}
			/>
			<Route path="/verify/:token" element={<Verify />} />
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
		<ErrorBoundary>
			<AuthProvider>
				<ThemeProvider>
					<AudioProvider>
						<RouterProvider router={router} />
						<ToastContainer position="bottom-right" theme="colored" />
					</AudioProvider>
				</ThemeProvider>
			</AuthProvider>
		</ErrorBoundary>
	</StrictMode>,
);
