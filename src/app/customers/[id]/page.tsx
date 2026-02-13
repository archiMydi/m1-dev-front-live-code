import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconPlus, IconChevronLeft } from "@tabler/icons-react";
import { customers } from "../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { VehicleSectionHeader } from "./vehicle-section-header";
import { HistoryDataTable } from "./history-table";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const customer = customers.find((c) => c.id === id);

	if (!customer) {
		notFound();
	}

	// Détermine la dernière interventionen triant les intervention par date de début (startDate) et en prenant la plus récente
	const lastIntervention = customer.interventions.sort(
		(a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
	)[0];

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
				<div className="flex flex-1 flex-col gap-4 p-4 pb-20 lg:p-6 lg:pb-6">
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
						<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm lg:rounded-xl lg:border lg:border-zinc-200 lg:p-6 lg:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:dark:border-zinc-800 lg:dark:bg-zinc-950">
							<div className="mb-6 flex items-center gap-4">
								<Avatar className="h-16 w-16 border border-zinc-200 dark:border-zinc-700">
									<AvatarImage
										src={`https://api.dicebear.com/9.x/initials/svg?seed=${customer.firstName} ${customer.name}`}
										alt={`${customer.firstName} ${customer.name}`}
									/>
									<AvatarFallback className="text-xl">
										{customer.firstName[0]}
										{customer.name[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="text-lg font-semibold tracking-tight lg:text-lg">
										{customer.firstName} {customer.name}
									</h2>
									<p className="text-muted-foreground text-sm">
										Client #{customer.id}
									</p>
								</div>
							</div>

							<div className="space-y-4 text-sm text-zinc-600 lg:space-y-2 dark:text-zinc-400">
								<div className="flex flex-col border-b border-zinc-100 pb-2 lg:block lg:border-none lg:pb-0 dark:border-zinc-800">
									<span className="mb-1 font-medium text-zinc-900 lg:mb-0 dark:text-zinc-100">
										Email
									</span>
									<span className="text-muted-foreground break-all lg:text-zinc-600 lg:before:content-[':_'] dark:lg:text-zinc-400">
										{customer.email}
									</span>
								</div>
								<div className="flex flex-col border-b border-zinc-100 pb-2 lg:block lg:border-none lg:pb-0 dark:border-zinc-800">
									<span className="mb-1 font-medium text-zinc-900 lg:mb-0 dark:text-zinc-100">
										Téléphone
									</span>
									<span className="text-muted-foreground lg:text-zinc-600 lg:before:content-[':_'] dark:lg:text-zinc-400">
										01 02 03 04 05
									</span>
								</div>
								<div className="flex flex-col border-b border-zinc-100 pb-2 lg:block lg:border-none lg:pb-0 dark:border-zinc-800">
									<span className="mb-1 font-medium text-zinc-900 lg:mb-0 dark:text-zinc-100">
										Code postal
									</span>
									<span className="text-muted-foreground lg:text-zinc-600 lg:before:content-[':_'] dark:lg:text-zinc-400">
										{customer.postalcode}
									</span>
								</div>
								<div className="flex flex-col lg:block">
									<span className="mb-1 font-medium text-zinc-900 lg:mb-0 dark:text-zinc-100">
										Ville
									</span>
									<span className="text-muted-foreground lg:text-zinc-600 lg:before:content-[':_'] dark:lg:text-zinc-400">
										{customer.city}
									</span>
								</div>
							</div>
						</section>

						{/* Section: Véhicules */}
						<section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm lg:rounded-xl lg:border lg:border-zinc-200 lg:p-4 lg:shadow-sm dark:border-zinc-800 lg:dark:bg-zinc-900/50">
							<h2 className="text-lg font-semibold tracking-tight lg:text-lg">
								Véhicules
							</h2>
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

						{/* Section: Historique Rapide (Dernière intervention) */}
						<section className="col-span-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-1 dark:border-zinc-800 dark:bg-zinc-950">
							<h2 className="text-lg font-semibold tracking-tight lg:text-lg">
								Dernière intervention
							</h2>
							{lastIntervention ? (
								<div className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Date:</span>
										<span className="font-medium text-zinc-900 dark:text-zinc-100">
											{lastIntervention.startDate}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Véhicule:</span>
										<span className="font-medium text-zinc-900 dark:text-zinc-100">
											{lastIntervention.vehiclePlate}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Type:</span>
										<span className="font-medium text-zinc-900 dark:text-zinc-100">
											{lastIntervention.type}
										</span>
									</div>
									<div className="flex justify-between border-t pt-2">
										<span className="text-muted-foreground">Montant:</span>
										<span className="font-bold text-zinc-900 dark:text-zinc-100">
											{lastIntervention.totalPrice} €
										</span>
									</div>
								</div>
							) : (
								<div className="py-4 text-sm text-zinc-500">
									Aucune intervention enregistrée.
								</div>
							)}
						</section>
					</div>

					{/* Section: Historique Complet (Tableau) */}
					<section className="mt-4 flex flex-1 flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
						<div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
							<h2 className="text-lg font-semibold">Historique des réparations</h2>
						</div>
						<div className="p-4">
							<HistoryDataTable data={customer.interventions} />
						</div>
					</section>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
