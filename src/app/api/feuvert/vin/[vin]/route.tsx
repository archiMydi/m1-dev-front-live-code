import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ vin: string }> }) {
	const { vin } = await params;

	console.log(`/*********** \nReceived request for VIN: ${vin}`);
	console.log("Fetching data from API...");

	const targetUrl = `https://api-front.feuvert.fr/api/v1/vehicles/vehicleinformation?RegistrationNumber=${vin}`;

	const headers = {
		host: "api-front.feuvert.fr",
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
		accept: "*/*",
		"accept-language": "en-US,en;q=0.9",
		"accept-encoding": "gzip, deflate, br, zstd",
		referer: "https://www.feuvert.fr/",
		"x-correlation-id": "2548ee08-2a81-42f6-905d-d638fe4f2f10",
		"x-csrf-token":
			"s5ZN/o0rpHd8v2W/Y3vEJg==:TCbaQBOgNvp6LG2lghW0o8cQXIKHSBpprBzm3AihmFUtiL2YZFvoGeFaqCGn+FaD",
		origin: "https://www.feuvert.fr",
		connection: "keep-alive",
		cookie: "datadome=DsP5x7XGsgllyZWyshwnZF6lp~xpqX_wlDxzrZJ_j3YncV3QhDbsD0jp2r4dGqrfjViIxTysrL~gsg4Qh5NZjpaNkBIiiGhePp~wCGcaIoKEOosKlETZ4Hr24JPKx50h; eeb_master=ddf99a17-fb88-4af9-9baa-9df38e8ab2ee; eeb_csrf=9814c3b4-822a-4039-b049-2e03b75e1051; session-affinity-fv3=1770712794.988.33907.912536|c9dfd244d691f7869ebe107c50658509; _pcid=1bbb4262-2868-7239-67ba-4bf883ec5d08; _pcid_creation_date=2026-02-10T00%3A00%3A00.000Z; ty_session=true; ty_id=6d5604e3-875c-505c-116d-c44554d20c6b; ty_ead=eyJjdXJyZW50Q2FtcGFpZ24iOnsiZGF0ZSI6MTc3MDcxMjc5NjMzNCwicmVmZXJyZXIiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsInRhcmdldCI6Imh0dHBzOi8vd3d3LmZldXZlcnQuZnIvY2VudHJlcy1hdXRvL3Zhbm5lcy9mZXUtdmVydC12YW5uZXMvMTQ4Lmh0bWw%2FdXRtX2NhbXBhaWduPWJvdXRvbl9zaXRlX2dtYiZ1dG1fbWVkaXVtPW9yZ2FuaWMmdXRtX3NvdXJjZT1nbWIifSwicmVmZXJyZXIiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsInRhcmdldCI6Imh0dHBzOi8vd3d3LmZldXZlcnQuZnIvY2VudHJlcy1hdXRvL3Zhbm5lcy9mZXUtdmVydC12YW5uZXMvMTQ4Lmh0bWw%2FdXRtX2NhbXBhaWduPWJvdXRvbl9zaXRlX2dtYiZ1dG1fbWVkaXVtPW9yZ2FuaWMmdXRtX3NvdXJjZT1nbWIifQ%3D%3D",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		priority: "u=4",
		te: "trailers",
	};

	try {
		const response = await fetch(targetUrl, {
			method: "GET",
			headers: headers as any, // Casting pour TypeScript
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.log(`API Error Status: ${response.status}`);
			console.log(`API Error Body: ${errorText.slice(0, 200)}`); // Log le début de l'erreur pour debug
			throw new Error(`Erreur API Externe: ${response.status}`);
		}

		const data = await response.json();

		console.log(`Response received successfully.`);
		console.log(`Request for VIN ${vin} completed. \n***********/`);

		return NextResponse.json(data);
	} catch (error: any) {
		console.error(`Error fetching data for VIN ${vin}:`, error.message);
		console.log(`***********/`);

		return NextResponse.json(
			{ error: "An error occurred during the request." },
			{ status: 500 },
		);
	}
}
