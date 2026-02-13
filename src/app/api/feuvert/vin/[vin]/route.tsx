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
		cookie: "datadome=gXUh1_KwgsYVY03RmQoEVZspqtcBGXGyNEML60emwEzChRXrhDDpWIQ4N9xfxG9mmxTizW6IQ16XMjQEzH6UFpF3Wv5lyy~3odEyq2Jt5vWXeQy8unuYKv9xH2JuKp0l; eeb_master=ddf99a17-fb88-4af9-9baa-9df38e8ab2ee; eeb_csrf=9814c3b4-822a-4039-b049-2e03b75e1051; _pcid=1bbb4262-2868-7239-67ba-4bf883ec5d08; _pcid_creation_date=2026-02-10T00%3A00%3A00.000Z; ty_id=6d5604e3-875c-505c-116d-c44554d20c6b; ty_ead=eyJjdXJyZW50Q2FtcGFpZ24iOnsiZGF0ZSI6MTc3MDk3MjU1ODYzNywicmVmZXJyZXIiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsInRhcmdldCI6Imh0dHBzOi8vd3d3LmZldXZlcnQuZnIvIn0sInJlZmVycmVyIjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJ0YXJnZXQiOiJodHRwczovL3d3dy5mZXV2ZXJ0LmZyLyJ9; session-affinity-fv3=1770972544.358.33685.930060|c9dfd244d691f7869ebe107c50658509; ty_session=true",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		priority: "u=4",
		te: "trailers",
	};

	try {
		const response = await fetch(targetUrl, {
			method: "GET",
			headers: headers as any,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.log(`API Error Status: ${response.status}`);
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
