import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { IconPlus, IconChevronLeft } from "@tabler/icons-react";
import { customers } from "../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VehicleSectionHeader } from "./vehicle-section-header";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const customer = customers.find((c) => c.id === id);

	if (!customer) {
		notFound();
	}

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
				<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
					<div className="flex items-center gap-4">
						<Button variant="ghost" size="icon" asChild className="size-8">
							<Link href="/customers">
								<IconChevronLeft className="size-4" />
							</Link>
						</Button>
						<h1 className="hidden text-2xl font-bold tracking-tight lg:block">
							Détail Client
						</h1>
					</div>

					<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
						{/* Section: Infos personnelles */}
						<section className="bg-white p-0 shadow-none lg:rounded-xl lg:border lg:border-zinc-200 lg:p-4 lg:shadow-sm dark:bg-transparent lg:dark:border-zinc-800 lg:dark:bg-zinc-950">
							<h2 className="text-2xl font-bold tracking-tight">
								{customer.firstName} {customer.name}
							</h2>

							<div className="space-y-1 text-sm text-zinc-600 lg:space-y-2 dark:text-zinc-400">
								<p>
									<span className="font-medium text-zinc-900 dark:text-zinc-100">
										Email:
									</span>{" "}
									{customer.email}
								</p>
								<p>
									<span className="font-medium text-zinc-900 dark:text-zinc-100">
										Téléphone:
									</span>{" "}
									01 02 03 04 05
								</p>
								<p>
									<span className="font-medium text-zinc-900 dark:text-zinc-100">
										Code postal:
									</span>{" "}
									{customer.postalcode}
								</p>
								<p>
									<span className="font-medium text-zinc-900 dark:text-zinc-100">
										Ville:
									</span>{" "}
									{customer.city}
								</p>
							</div>
						</section>

						{/* Section: Véhicules */}
						<section className="bg-white p-0 shadow-none lg:rounded-xl lg:border lg:border-zinc-200 lg:p-4 lg:shadow-sm dark:bg-transparent lg:dark:border-zinc-800 lg:dark:bg-zinc-950">
							<VehicleSectionHeader customerId={customer.id} />
							<div className="space-y-3 lg:space-y-4">
								{customer.vehicles.map((vehicle, index) => (
									<div
										key={index}
										className="border-b border-zinc-100 pb-2 lg:rounded-lg lg:border lg:bg-zinc-50 lg:p-3 dark:border-zinc-800 lg:dark:bg-zinc-900/50"
									>
										<div className="flex items-center justify-between">
											<span className="font-medium">
												{vehicle.brand} {vehicle.model}
											</span>
										</div>
										<div className="text-muted-foreground text-xs">
											<p>Immat: {vehicle.plate}</p>
											<p>VIN: {vehicle.vin}</p>
										</div>
									</div>
								))}
							</div>
						</section>

						{/* Section: Historique Rapide */}
						<section className="col-span-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-950">
							<h2 className="text-2xl font-bold tracking-tight">
								Dernière intervention
							</h2>
							<div className="text-sm text-zinc-600 dark:text-zinc-400">
								<p>Date: {customer.lastIntervention.date}</p>
								<p>Kilométrage: {customer.lastIntervention.mileage}</p>
								<p>Type: {customer.lastIntervention.type}</p>
							</div>
						</section>
					</div>

					{/* Section: Historique Complet (Tableau) */}
					<section className="mt-4 flex flex-1 flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
						<div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
							<h2 className="text-lg font-semibold">Historique des réparations</h2>
						</div>
						<div className="flex flex-1 items-center justify-center p-8 text-zinc-500">
							Données de l'historique (TODO)
						</div>
					</section>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
