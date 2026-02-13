"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Search, Car, Calendar, Gauge, Settings, Link as LinkIcon } from "lucide-react";
import { buildBPartsSlug } from "@/lib/slugBuilder";

export default function Page() {
	const [plate, setPlate] = useState("");
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const searchParams = useSearchParams();

	const fetchVehicleData = async (plateToSearch: string) => {
		setLoading(true);
		setError("");
		setData(null);

		const cleanPlate = plateToSearch.replace(/[^a-zA-Z0-9]/g, "");

		try {
			const resVin = await fetch(`/api/feuvert/vin/${cleanPlate}`);

			if (!resVin.ok) {
				throw new Error("Véhicule introuvable ou erreur technique.");
			}

			const dataVin = await resVin.json();

			if (!dataVin.all || dataVin.all.length === 0) {
				throw new Error("Aucune information trouvée pour cette plaque");
			}

			console.log("Infos Voiture (Norauto):", dataVin);

			const generatedSlug = buildBPartsSlug(dataVin);
			console.log("Slug généré :", generatedSlug);

			setData({
				...dataVin,
				bParts: {
					versions: [{ slug: generatedSlug }],
				},
			});
		} catch (err: any) {
			console.error("Erreur critique:", err);
			setError(err.message || "Une erreur est survenue lors de la recherche.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const queryPlate = searchParams.get("plate");
		if (queryPlate) {
			setPlate(queryPlate);
			fetchVehicleData(queryPlate);
		}
	}, [searchParams]);

	const lancerRecherche = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!plate) return;
		await fetchVehicleData(plate);
	};

	const getFeature = (key: string) => {
		if (!data?.all?.[0]) return "N/A";
		const vehicle = data.all[0];

		const immatAttr = vehicle.immatAttributes?.find((a: any) => a.name === key);
		if (immatAttr) return immatAttr.value;

		const genAttr = vehicle.attributes?.find((a: any) => a.type === key);
		if (genAttr) return genAttr.value;

		if (key === "KTYPE") {
			const ktype = vehicle.idsOther?.find((a: any) => a.name === "KTYPE");
			return ktype ? ktype.value : "N/A";
		}

		return "N/A";
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return "N/A";
		if (dateString.includes("/")) return dateString;
		if (dateString.length === 8) {
			return `${dateString.substring(6, 8)}/${dateString.substring(4, 6)}/${dateString.substring(0, 4)}`;
		}
		return dateString;
	};

	const vehicle = data?.all?.[0];
	const slug = data?.bParts?.versions?.[0]?.slug;

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
					{/* Formulaire de recherche */}
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

					{/* Affichage des Résultats */}
					{vehicle && (
						<div className="animate-in fade-in slide-in-from-bottom-4 grid grid-cols-1 gap-6 duration-500 md:grid-cols-3">
							{/* Carte Principale */}
							<div className="overflow-hidden rounded-xl border bg-white shadow-sm md:col-span-3">
								<div className="flex flex-col md:flex-row">
									<div className="flex items-center justify-center border-b bg-slate-50 p-6 md:w-1/3 md:border-r md:border-b-0">
										<Car className="h-24 w-24 text-slate-300" />
									</div>
									<div className="flex flex-col justify-center p-6 md:w-2/3">
										<div className="mb-2 inline-flex flex-wrap items-center gap-2">
											<span className="rounded border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 uppercase">
												{vehicle.brand?.label}
											</span>
											<span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-600">
												{getFeature("IMMAT")}
											</span>

											{/* Affichage du Slug Généré */}
											{slug && (
												<div className="flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs text-purple-800">
													<LinkIcon className="h-3 w-3" />
													<span
														className="max-w-50 truncate font-mono md:max-w-xs"
														title={slug}
													>
														{slug}
													</span>
												</div>
											)}
										</div>

										<h2 className="mb-2 text-3xl font-bold text-slate-900">
											{vehicle.model?.label}
										</h2>
										<p className="text-lg text-slate-600">
											{vehicle.cyl?.label}
										</p>
										<p className="mt-1 text-sm text-slate-400">
											VIN: {getFeature("CODIF_VIN_PRF")}
										</p>
									</div>
								</div>
							</div>

							{/* Carte Motorisation */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<Gauge className="h-5 w-5 text-blue-600" />
									<span>Motorisation</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-500">Carburant</span>
										<span className="font-medium capitalize">
											{getFeature("ENERGIE")?.toLowerCase() ||
												getFeature("TYPEMOTEUR")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Puissance</span>
										<span className="font-medium">
											{getFeature("PUIMOTCVX")} ch ({getFeature("PUIS_FISC")}{" "}
											CV)
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Cylindrée</span>
										<span className="font-medium">
											{getFeature("MOTCYLTEC")} cm³ ({getFeature("NBRCYLIND")}{" "}
											cyl.)
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Code Moteur</span>
										<span className="font-medium">
											{getFeature("CODEMOTEUR") || getFeature("MOTEUR")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Pollution (CO2)</span>
										<span className="font-medium">
											{getFeature("CO2")} g/km
										</span>
									</div>
								</div>
							</div>

							{/* Carte Transmission */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<Settings className="h-5 w-5 text-blue-600" />
									<span>Transmission & Châssis</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-500">Boîte de vitesse</span>
										<span className="font-medium capitalize">
											{getFeature("TP_BOITE_VIT")?.toLowerCase()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Rapports</span>
										<span className="font-medium">
											{getFeature("NB_VITESSES")} vitesses
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Transmission</span>
										<span className="font-medium capitalize">
											{getFeature("PROPULSION")?.toLowerCase()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Poids à vide</span>
										<span className="font-medium">
											{getFeature("POIDS_VIDE")} kg
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Carrosserie</span>
										<span className="font-medium capitalize">
											{getFeature("CARROSSERIE")?.toLowerCase() ||
												getFeature("CARROSS")}{" "}
											({getFeature("NB_PORTES")} portes)
										</span>
									</div>
								</div>
							</div>

							{/* Carte Dates */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<Calendar className="h-5 w-5 text-blue-600" />
									<span>Dates & Divers</span>
								</div>
								<div className="space-y-3 text-sm">
									<div className="flex justify-between">
										<span className="text-slate-500">Mise en circ.</span>
										<span className="font-medium">
											{formatDate(getFeature("DATE_1ER_CIR"))}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Carte grise</span>
										<span className="font-medium">
											{formatDate(getFeature("DATE_DCG"))}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Type Mine</span>
										<span className="font-medium">{getFeature("TYPE_CG")}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">K-Type (TecDoc)</span>
										<span className="rounded bg-slate-100 px-2 font-medium">
											{getFeature("KTYPE")}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-slate-500">Couleur</span>
										<span className="font-medium capitalize">
											{getFeature("COULEUR_VEHIC")?.toLowerCase()}
										</span>
									</div>
								</div>
							</div>
							{/* pièces */}
							<div className="rounded-xl border bg-white p-5 shadow-sm">
								<div className="mb-4 flex items-center gap-2 border-b pb-2 font-semibold text-slate-800">
									<LinkIcon className="h-5 w-5 text-blue-600" />
									<span>Pièces compatibles</span>
								</div>
								<div className="space-y-3 text-sm">
									<a
										href={`https://www.bparts.com/fr/fiche-technique/${slug}`}
										target="_blank"
										className="flex items-center gap-2 rounded bg-purple-50 px-3 py-2 text-sm font-medium text-purple-800 transition-colors hover:bg-purple-100"
									>
										<LinkIcon className="h-4 w-4" />
										Voir sur BParts
									</a>
								</div>
							</div>
						</div>
					)}

					{/* Zone Debug */}
					{data && (
						<details className="mt-8 text-xs text-slate-400">
							<summary className="mb-2 cursor-pointer hover:text-slate-300">
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
