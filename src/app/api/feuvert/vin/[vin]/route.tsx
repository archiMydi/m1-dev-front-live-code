import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ vin: string }> }) {
	const { vin } = await params;

	console.log(`[Norauto API] Request for VIN/Plate: ${vin}`);

	const targetUrl = `https://www.norauto.fr/next-e-shop/car-selector/identification/reg-vin/external/${vin}?shop=9902&reg-country=FR`;

	const headers = {
		Host: "www.norauto.fr",
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
		Accept: "*/*",
		"Accept-Language": "en-US,en;q=0.9",
		"Accept-Encoding": "gzip, deflate, br, zstd",
		Referer: "https://www.norauto.fr/",
		lang: "fr",
		country: "FR",
		Connection: "keep-alive",
		Cookie: "datadome=Nu9nfW3l81ysTAztWUFaDDJzPusV0XXnM5SGUmE3MmCJOOxmNKb_dKFqgC6zTGXXvoMKi8Pr3wjuOmkVvsWYGkSVAeMTBjtJ0UcDVsfd5xcPg5k2X_h6EDRljiM2L28f; TCPID=126130525410279354447; _dd_s=aid=17c7b0b4-1b9f-48a0-885d-dd4b43ef47b1&rum=0&expire=1770976078858; CNIL=0%40029%7C1%7C6602%402%2C3%2C4%401%401769557976187%2C1769557976187%2C1803253976187%40; CNIL_CENTER=2%2C3%2C4; tns.geostore=1; sess=s%3AJ9xQc5demrIh5WheDCK8o0FJiFwKjIBF.R%2F9vsnMt2pkEvXr1jUTVncYXT%2B04Bje1pumAPFDpFBY",
		"Sec-Fetch-Dest": "empty",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Site": "same-origin",
		Priority: "u=0",
		TE: "trailers",
	};

	try {
		const response = await fetch(targetUrl, {
			method: "GET",
			headers: headers as any,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[Norauto API] Error: ${response.status} - ${errorText.slice(0, 100)}`);
			throw new Error(`Norauto API Error: ${response.status}`);
		}

		const data = await response.json();

		console.log(`[Norauto API] Success for ${vin}`);
		return NextResponse.json(data);
	} catch (error: any) {
		console.error(`[Norauto API] Critical Error:`, error.message);
		return NextResponse.json({ error: "An error occurred with Norauto API." }, { status: 500 });
	}
}
