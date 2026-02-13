import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ plate: string }> }) {
	const { plate } = await params;

	const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, "");

	console.log(`/*********** \n[Slug API] Request for Plate: ${cleanPlate}`);

	const targetUrl = `https://feuvert.b-parts.com/api/fr/shop/cars/search_by_plate_or_vin?search=${cleanPlate}`;

	const headers = {
		Host: "feuvert.b-parts.com",
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
		Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		"Accept-Language": "en-US,en;q=0.9",
		"Accept-Encoding": "gzip, deflate, br, zstd",
		Connection: "keep-alive",
		"Upgrade-Insecure-Requests": "1",
		"Sec-Fetch-Dest": "document",
		"Sec-Fetch-Mode": "navigate",
		"Sec-Fetch-Site": "none",
		Priority: "u=0, i",
		TE: "trailers",
		Cookie: "intercom-id-npdb81wn=7ccf15d5-60a0-41b0-96ad-e839f0fb81e8; intercom-session-npdb81wn=; intercom-device-id-npdb81wn=da60c012-623b-4b16-9b44-b1ea7c8a6c2d; _cookie_required=1; _cookie_preferences=1; _cookie_markting=1; _cookie_statistics=1; _currency=EUR; _shipping_location=11; _language=fr; django_language=; aws-waf-token=201bc719-579e-47ef-80fc-dbad169449fd:CgoAqqpArucrAAAA:80cpFKalIEM73vX/zusXznTv8g5KBuhsgk9v3LgV3Z8SC0NYHrjV+WKGuDuc+u2E8jrBfdv/GhhavNWbIQyF33CdtCNQuPJaPFeUY/CDOyplOyCU18RARxwmQ7IkPzp/EpCpdFaYn4pL+wxiBPs5ceknhWNAG2o3RDOgb3OLPH7IqkbNqZF9tFnfeinDIj7bLWvPUg==; sessionid=iqf3b880m6f1kwxph0kpn8r8xq0ttqpo",
	};

	try {
		console.log(`[Slug API] Fetching from: ${targetUrl}`);

		const response = await fetch(targetUrl, {
			method: "GET",
			headers: headers as any,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[Slug API] Error ${response.status}: ${errorText.slice(0, 200)}`);
			throw new Error(`Erreur B-Parts: ${response.status}`);
		}

		const data = await response.json();

		const foundSlug =
			data.versions && data.versions.length > 0 ? data.versions[0].slug : "NON_TROUVE";

		console.log(`[Slug API] Success. Slug trouvé: ${foundSlug}`);
		console.log(`[Slug API] Completed. \n***********/`);

		return NextResponse.json(data);
	} catch (error: any) {
		console.error(`[Slug API] Critical Error:`, error.message);
		return NextResponse.json({ error: "Impossible de récupérer le slug." }, { status: 500 });
	}
}
