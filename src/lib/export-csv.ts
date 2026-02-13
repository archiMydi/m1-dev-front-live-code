export interface CSVExportData {
	[key: string]: string | number | boolean | null;
}

export function generateCSV(data: CSVExportData[], filename: string = "export.csv"): void {
	if (data.length === 0) {
		console.warn("Aucune donnée à exporter");
		return;
	}

	// Récupérer les en-têtes
	const headers = Object.keys(data[0]);

	// Construire le contenu CSV
	const csvContent = [
		// En-têtes
		headers.map((header) => `"${header}"`).join(","),
		// Données
		...data.map((row) =>
			headers
				.map((header) => {
					const value = row[header];
					if (value === null || value === undefined) return '""';
					if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
					return value;
				})
				.join(","),
		),
	].join("\n");

	// Créer un blob et télécharger
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", filename);
	link.style.visibility = "hidden";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export function getAccountingCSVData(
	chartData: Array<{ date: string; revenue: number; missions: number }>,
) {
	return chartData.map((item) => ({
		Date: item.date,
		"Revenus (€)": item.revenue.toFixed(2),
		"Nombre de missions": item.missions,
		"Revenu moyen": (item.revenue / item.missions).toFixed(2),
	}));
}
