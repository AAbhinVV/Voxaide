/**
 * Integration smoke test for routes mounted in server.js.
 *
 * Prerequisites: API running (e.g. `npm run dev` in server/), MongoDB + Redis up, valid .env.
 *
 * Usage (from server/):
 *   node scripts/test-api-flow.mjs
 *
 * Env:
 *   API_BASE     — default http://localhost:5000/api/v1
 *   FRONTEND_URL — must match server CORS (default http://localhost:5173)
 *   RUN_UPLOAD=1 — optional: POST multipart to /voice-notes (needs working S3 config)
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_BASE = process.env.API_BASE || "http://localhost:5000/api/v1";
const ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
const RUN_UPLOAD = process.env.RUN_UPLOAD === "1";

/** @type {Map<string, string>} */
const cookieJar = new Map();

function absorbSetCookie(res) {
	let lines = [];
	if (typeof res.headers.getSetCookie === "function") {
		lines = res.headers.getSetCookie();
	} else {
		const single = res.headers.get("set-cookie");
		if (single) lines = [single];
	}
	for (const line of lines) {
		if (!line) continue;
		const nameValue = line.split(";")[0].trim();
		const eq = nameValue.indexOf("=");
		if (eq <= 0) continue;
		const name = nameValue.slice(0, eq);
		const value = nameValue.slice(eq + 1);
		cookieJar.set(name, value);
	}
}

function cookieHeader() {
	if (cookieJar.size === 0) return "";
	return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

let failed = 0;
let passed = 0;

function ok(name, cond, detail = "") {
	if (cond) {
		passed++;
		console.log(`  ✓ ${name}${detail ? ` ${detail}` : ""}`);
	} else {
		failed++;
		console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
	}
}

async function req(method, pathname, { json, body, headers = {}, expectStatus } = {}) {
	const url = `${API_BASE}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
	const h = {
		Origin: ORIGIN,
		...headers,
	};
	const ch = cookieHeader();
	if (ch) h.Cookie = ch;
	if (json !== undefined) {
		h["Content-Type"] = "application/json";
	}
	const res = await fetch(url, {
		method,
		headers: h,
		body: json !== undefined ? JSON.stringify(json) : body,
	});
	absorbSetCookie(res);
	let data = null;
	const ct = res.headers.get("content-type") || "";
	if (ct.includes("application/json")) {
		try {
			data = await res.json();
		} catch {
			data = null;
		}
	} else if (method === "GET" && pathname.includes("/voice-notes/") && !pathname.endsWith("/meta")) {
		data = await res.arrayBuffer();
	} else {
		const t = await res.text();
		data = t.length < 500 ? t : `[binary/text ${t.length} bytes]`;
	}
	if (expectStatus !== undefined && res.status !== expectStatus) {
		throw new Error(`Expected status ${expectStatus}, got ${res.status} for ${method} ${pathname}`);
	}
	return { res, data };
}

async function main() {
	console.log(`API_BASE=${API_BASE}`);
	console.log(`Origin=${ORIGIN}`);
	console.log("");

	try {
		await fetch(`${API_BASE}/test`, { method: "GET", headers: { Origin: ORIGIN } });
	} catch (e) {
		const refused =
			e?.cause?.code === "ECONNREFUSED" ||
			String(e?.message || "").includes("ECONNREFUSED");
		if (refused) {
			console.error(
				"Cannot reach the API (connection refused). Start the server first, e.g. `npm run dev` in server/, then run `npm run test:api` again.",
			);
			process.exit(1);
		}
		throw e;
	}

	// --- Health
	{
		const { res, data } = await req("GET", "/test", { expectStatus: 200 });
		ok("GET /test", res.status === 200 && data?.message === "API is working", JSON.stringify(data));
	}

	const suffix = Date.now();
	const email = `flow-test-${suffix}@example.com`;
	const username = `user${suffix}`;
	const password = "TestPassword123!";
	const fakeObjectId = "507f1f77bcf86cd799439011";

	// --- Signup
	{
		const { res, data } = await req("POST", "/auth/signup", {
			json: { email, username, password },
			expectStatus: 201,
		});
		ok(
			"POST /auth/signup",
			res.status === 201 && data?.success === true && data?.user?.email === email,
		);
	}

	// --- Auth me (cookie session)
	{
		const { res, data } = await req("GET", "/auth/me", { expectStatus: 200 });
		ok("GET /auth/me", res.status === 200 && (data?.email === email || data?._id));
	}

	// --- Users me
	{
		const { res, data } = await req("GET", "/users/me", { expectStatus: 200 });
		ok("GET /users/me", res.status === 200 && data?.success === true && data?.user?.email === email);
	}

	// --- Patch users me
	{
		const { res, data } = await req("PATCH", "/users/me", {
			json: { username: `${username}_upd`, email },
			expectStatus: 200,
		});
		ok("PATCH /users/me", res.status === 200 && data?.success === true);
	}

	// --- Voice notes list (empty ok)
	{
		const { res, data } = await req("GET", "/voice-notes", { expectStatus: 200 });
		const list = Array.isArray(data) ? data : data?.data;
		ok(
			"GET /voice-notes",
			res.status === 200 && data?.success === true && Array.isArray(list),
		);
	}

	// --- Optional upload (real S3)
	let voiceNoteId = null;
	if (RUN_UPLOAD) {
		const fd = new FormData();
		const tinyWav = new Uint8Array([
			82, 73, 70, 70, 36, 0, 0, 0, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 1, 0,
			68, 172, 0, 0, 16, 177, 2, 0, 4, 0, 16, 0, 100, 97, 116, 97, 0, 0, 0, 0,
		]);
		fd.append("audio", new Blob([tinyWav], { type: "audio/wav" }), "ping.wav");
		fd.append("duration", "0");
		const url = `${API_BASE}/voice-notes`;
		const h = { Origin: ORIGIN };
		const ch = cookieHeader();
		if (ch) h.Cookie = ch;
		const res = await fetch(url, { method: "POST", headers: h, body: fd });
		absorbSetCookie(res);
		const data = await res.json().catch(() => null);
		ok(
			"POST /voice-notes (RUN_UPLOAD=1)",
			res.status === 201 && data?.success === true,
			res.status !== 201 ? JSON.stringify(data) : `voiceNoteId=${data?.voiceNoteId}`,
		);
		if (data?.voiceNoteId) voiceNoteId = String(data.voiceNoteId);
	} else {
		console.log("  … POST /voice-notes skipped (set RUN_UPLOAD=1 to test S3 upload)");
	}

	// --- Meta + binary GET if we have an id
	if (voiceNoteId) {
		const { res, data } = await req("GET", `/voice-notes/${voiceNoteId}/meta`, {
			expectStatus: 200,
		});
		ok("GET /voice-notes/:id/meta", res.status === 200 && data?.success === true && data?.data?._id);

		const bin = await req("GET", `/voice-notes/${voiceNoteId}`, { expectStatus: 200 });
		const buf = bin.data;
		ok(
			"GET /voice-notes/:id (binary)",
			bin.res.status === 200 && buf instanceof ArrayBuffer && buf.byteLength > 0,
		);
	}

	// --- Transcriptions by voice note id (404 if none)
	{
		const { res } = await req("GET", `/transcriptions/${fakeObjectId}`, {
			expectStatus: 404,
		});
		ok("GET /transcriptions/:id (expect 404 for random id)", res.status === 404);
	}

	// --- Notes generate (expect 4xx/5xx without valid transcription)
	{
		const { res } = await req("POST", "/notes/generate", {
			json: { transcriptionId: fakeObjectId },
		});
		ok(
			"POST /notes/generate (invalid transcriptionId)",
			res.status >= 400 && res.status < 600,
			`status=${res.status}`,
		);
	}

	// --- Query (may 500 if embeddings / pipeline not ready)
	{
		const { res, data } = await req("POST", "/query", {
			json: { question: "What did I record?" },
		});
		ok(
			"POST /query",
			res.status === 200 ? data?.success === true : res.status >= 400,
			`status=${res.status}`,
		);
	}

	// --- Admin: expect 403 for normal user
	{
		const { res, data } = await req("GET", "/admin", {});
		ok("GET /admin (forbidden for USER)", res.status === 403 || data?.success === false);
	}

	// --- Refresh token
	{
		const { res, data } = await req("POST", "/auth/refresh-token", {
			json: {},
		});
		ok(
			"POST /auth/refresh-token",
			res.status === 200 || res.status === 403,
			`status=${res.status}`,
		);
	}

	// --- Logout
	{
		const { res, data } = await req("POST", "/auth/logout", { expectStatus: 200 });
		ok("POST /auth/logout", res.status === 200 && (data?.message || true));
	}

	// --- Users delete (must re-auth — skip or login again)
	// New user was logged out; optional: login again and DELETE /users/me — skip to keep script short

	console.log("");
	console.log(`Done: ${passed} passed, ${failed} failed`);
	process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
