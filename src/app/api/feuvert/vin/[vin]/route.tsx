import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Chemins des dossiers (à la racine du projet)
const JSON_DIR = path.join(process.cwd(), "json_res_norauto"); // J'ai changé le dossier pour séparer de FeuVert
const LOG_DIR = path.join(process.cwd(), "logs");

// Helper pour créer les dossiers s'ils n'existent pas
async function ensureDirectories() {
	await fs.mkdir(JSON_DIR, { recursive: true });
	await fs.mkdir(LOG_DIR, { recursive: true });
}

export async function GET(request: Request, { params }: { params: Promise<{ vin: string }> }) {
	const { vin } = await params;
	await ensureDirectories();

	// Chemins des fichiers
	const filePath = path.join(JSON_DIR, `norauto_response_${vin}.json`);
	const accessLogPath = path.join(LOG_DIR, "access_norauto.log");
	const errorLogPath = path.join(LOG_DIR, "error_norauto.log");

	console.log(`/*********** \n[Norauto] Received request for Plate/VIN: ${vin}`);

	// URL Norauto
	// Note: le paramètre query 'shop=9902' semble être un ID de magasin par défaut, 'reg-country=FR' pour la France.
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
		// Les cookies Norauto (Datadome + Session)
		Cookie: "datadome=Nu9nfW3l81ysTAztWUFaDDJzPusV0XXnM5SGUmE3MmCJOOxmNKb_dKFqgC6zTGXXvoMKi8Pr3wjuOmkVvsWYGkSVAeMTBjtJ0UcDVsfd5xcPg5k2X_h6EDRljiM2L28f; TCPID=126130525410279354447; _dd_s=aid=17c7b0b4-1b9f-48a0-885d-dd4b43ef47b1&rum=0&expire=1770976078858; CNIL=0%40029%7C1%7C6602%402%2C3%2C4%401%401769557976187%2C1769557976187%2C1803253976187%40; CNIL_CENTER=2%2C3%2C4; tns.geostore=1; sess=s%3AJ9xQc5demrIh5WheDCK8o0FJiFwKjIBF.R%2F9vsnMt2pkEvXr1jUTVncYXT%2B04Bje1pumAPFDpFBY",
		"Sec-Fetch-Dest": "empty",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Site": "same-origin", // Important car l'API attend que ça vienne du même domaine (simulé par les headers Host/Referer)
		Priority: "u=0",
		TE: "trailers",
	};

	try {
		console.log("[Norauto] Fetching data from API (Forced)...");

		const response = await fetch(targetUrl, {
			method: "GET",
			headers: headers as any,
		});

		if (!response.ok) {
			throw new Error(`Norauto API Error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();

		// Sauvegarde JSON
		await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
		console.log(`[Norauto] Response saved to ${filePath}`);
		console.log(`[Norauto] Request completed successfully. \n***********/`);

		// Log Access
		const logEntry = `${new Date().toISOString()} - VIN: ${vin} - Status: ${response.status} - URL: ${targetUrl} \n`;
		await fs.appendFile(accessLogPath, logEntry, "utf8");

		return NextResponse.json(data);
	} catch (error: any) {
		console.error(`[Norauto] Error fetching data for VIN ${vin}:`, error.message);

		// Log Error
		const errorLogEntry = `${new Date().toISOString()} - Error: ${error.message}\n`;
		try {
			await fs.appendFile(errorLogPath, errorLogEntry, "utf8");
		} catch (e) {
			console.error("Could not write to error log");
		}

		return NextResponse.json({ error: "An error occurred with Norauto API." }, { status: 500 });
	}
}
