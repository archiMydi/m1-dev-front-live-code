"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Search, Car, Calendar, Gauge, Settings } from "lucide-react";

export default function Page() {
	const [plate, setPlate] = useState("");
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const lancerRecherche = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!plate) return;

		setLoading(true);
		setError("");
		setData(null);

		const cleanPlate = plate.replace(/[^a-zA-Z0-9]/g, "");

		try {
			const [resVin, resSlug] = await Promise.all([
				fetch(`/api/feuvert/vin/${cleanPlate}`),
				fetch(`/api/feuvert/slug/${cleanPlate}`),
			]);

			if (!resVin.ok) {
				throw new Error("Véhicule introuvable ou erreur du service d'immatriculation. ");
			}

			const dataVin = await resVin.json();

			let dataSlug = null;
			if (resSlug.ok) {
				dataSlug = await resSlug.json();
			} else {
				console.warn("Slug Service Error");
			}

			console.log("Infos Voiture:", dataVin);
			console.log("Infos Slug:", dataSlug);

			if (!dataVin.registrationNumber) {
				throw new Error("Aucune information trouvée pour cette plaque");
			}

			setData({
				...dataVin,
				bParts: dataSlug,
			});
		} catch (err: any) {
			console.error("Erreur critique:", err);
			setError(err.message || "Une erreur est survenue lors de la recherche.");
		} finally {
			setLoading(false);
		}
	};

	const getFeature = (name: string) => {
		if (!data?.additionalFeatures) return "N/A";
		const feature = data.additionalFeatures.find((f: any) => f.name === name);
		return feature ? feature.value : "N/A";
	};

	const formatDate = (dateString: string) => {
		if (!dateString || dateString.length !== 8) return dateString;
		return `${dateString.substring(6, 8)}/${dateString.substring(4, 6)}/${dateString.substring(0, 4)}`;
	};

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />

				<div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 pt-0">
					{/* Section Recherche */}
					<div className="rounded-xl border bg-white p-6 shadow-sm">
						<h1 className="mb-4 text-2xl font-bold text-slate-800">
							Identification par Plaque
						</h1>
						<form onSubmit={lancerRecherche} className="flex items-end gap-3">
							<div className="max-w-md flex-1">
								<label className="mb-1 ml-2 block text-sm font-medium text-slate-700">
									Numéro d'immatriculation
								</label>
								<div className="relative">
									<input
										type="text"
										value={plate}
										onChange={(e) => setPlate(e.target.value.toUpperCase())}
										placeholder="AA-123-BB"
										className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pr-4 pl-10 font-mono text-lg tracking-wider uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									/>
									<Search className="absolute top-3.5 left-3 h-5 w-5 text-slate-400" />
								</div>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{loading ? "Recherche..." : "Identifier"}
							</button>
						</form>
						{error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
					</div>

					{/* Section Résultats */}
					{data && (
						<div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-500 md:grid-cols-3">
							{/* Carte Principale (Image + Titre) */}
							<div className="overflow-hidden rounded-xl border bg-white shadow-sm md:col-span-3">
								<div className="flex flex-col md:flex-row">
									<div className="flex items-center justify-center border-b bg-slate-50 p-6 md:w-1/3 md:border-r md:border-b-0">
										{data.thumbnailUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={data.thumbnailUrl}
												alt="Voiture"
												className="max-h-48 object-contain mix-blend-multiply"
											/>
										) : (
											<Car className="h-24 w-24 text-slate-300" />
										)}
									</div>
									<div className="flex flex-col justify-center p-6 md:w-2/3">
										<div className="mb-2 inline-flex items-center gap-2">
											<span className="rounded border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 uppercase">
												{data.carBrand}
											</span>
											<span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-600">
												{data.registrationNumber}
											</span>
											{/* Badge Slug trouvé ou non */}
											{data.bParts?.versions?.[0]?.slug ? (
												<span className="rounded border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 uppercase">
													Slug Compatible
												</span>
											) : (
												<span className="rounded border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 uppercase">
													Slug Manquant
												</span>
											)}
										</div>
										<h2 className="mb-2 text-3xl font-bold text-slate-900">
											{data.commercialModel}
										</h2>
										<p className="text-lg text-slate-600">{data.engine}</p>
										<p className="mt-1 text-sm text-slate-400">
											VIN: {getFeature("vin_codif")}
										</p>
									</div>
								</div>
							</div>

							{/* Carte Technique */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<Gauge className="h-5 w-5 text-blue-600" />
									<span>Motorisation</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-500">Carburant</span>
										<span className="font-medium capitalize">
											{data.fuel?.toLowerCase()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Puissance</span>
										<span className="font-medium">
											{getFeature("horse_power")} ch (
											{getFeature("fiscal_horse_power")} CV)
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Cylindrée</span>
										<span className="font-medium">
											{getFeature("capacity")} cm³ (
											{getFeature("cylinder_engine")} cyl.)
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Code Moteur</span>
										<span className="font-medium">
											{getFeature("engine_id")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Pollution</span>
										<span className="font-medium">
											{getFeature("co2")} g/km (Crit'Air{" "}
											{getFeature("depollution") === "OUI" ? "?" : "?"})
										</span>
									</div>
								</div>
							</div>

							{/* Carte Transmission & Châssis */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<Settings className="h-5 w-5 text-blue-600" />
									<span>Transmission & Châssis</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-500">Boîte de vitesse</span>
										<span className="font-medium capitalize">
											{getFeature("transmission")?.toLowerCase()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Rapports</span>
										<span className="font-medium">
											{getFeature("number_of_gears")} vitesses
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Transmission</span>
										<span className="font-medium capitalize">
											{getFeature("drive_train")?.toLowerCase()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Poids à vide</span>
										<span className="font-medium">
											{getFeature("empty_weight")} kg
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Carrosserie</span>
										<span className="font-medium capitalize">
											{getFeature("body")?.toLowerCase()} (
											{getFeature("doors")} portes)
										</span>
									</div>
								</div>
							</div>

							{/* Carte Infos Légales */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<Calendar className="h-5 w-5 text-blue-600" />
									<span>Dates & Divers</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-500">Mise en circ.</span>
										<span className="font-medium">
											{formatDate(getFeature("initial_entry_into_service"))}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Carte grise</span>
										<span className="font-medium">
											{formatDate(getFeature("vhc_registration_date"))}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Type Mine</span>
										<span className="font-medium">
											{getFeature("mine_type")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">K-Type (TecDoc)</span>
										<span className="rounded bg-slate-100 px-2 font-medium">
											{data.ktype}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Couleur</span>
										<span className="font-medium capitalize">
											{getFeature("color")?.toLowerCase()}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Debug Raw Data */}
					{data && (
						<details className="mt-8 text-xs text-slate-400">
							<summary className="mb-2 cursor-pointer">
								Voir les données brutes JSON
							</summary>
							<pre className="max-h-40 overflow-auto rounded bg-slate-900 p-4 text-slate-50">
								{JSON.stringify(data, null, 2)}
							</pre>
						</details>
					)}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
