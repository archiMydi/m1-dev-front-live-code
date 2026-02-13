"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import Link from "next/link";

const missionsData = [
	{ date: "2024-04-01", price: 222 },
	{ date: "2024-04-02", price: 97 },
	{ date: "2024-04-03", price: 167 },
	{ date: "2024-04-04", price: 242 },
	{ date: "2024-04-05", price: 373 },
	{ date: "2024-04-06", price: 301 },
	{ date: "2024-04-07", price: 245 },
	{ date: "2024-04-08", price: 409 },
	{ date: "2024-04-09", price: 59 },
	{ date: "2024-04-10", price: 261 },
	{ date: "2024-04-11", price: 327 },
	{ date: "2024-04-12", price: 292 },
	{ date: "2024-04-13", price: 342 },
	{ date: "2024-04-14", price: 137 },
	{ date: "2024-04-15", price: 120 },
	{ date: "2024-04-16", price: 138 },
	{ date: "2024-04-17", price: 446 },
	{ date: "2024-04-18", price: 364 },
	{ date: "2024-04-19", price: 243 },
	{ date: "2024-04-20", price: 89 },
	{ date: "2024-04-21", price: 137 },
	{ date: "2024-04-22", price: 224 },
	{ date: "2024-04-23", price: 138 },
	{ date: "2024-04-24", price: 387 },
];

export default function Page() {
	const { data: missions, isLoading } = trpc.missions.list.useQuery();
	const { data: allParts } = trpc.parts.list.useQuery();
	console.log(allParts);

	const partsMap = new Map(allParts?.map((p) => [p.id, p]) || []);

	console.log(missions);
	const chartData =
		missions?.map((mission) => ({
			id: mission.id,
			date: mission.end,
			price: mission.totalPrice,
			parts: mission.parts.map((part) => partsMap.get(part)?.price),
		})) || [];
	console.log(chartData);
	const formatDate = (date: Date) =>
		date.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
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
				<div
					className="flex flex-1 flex-col"
					style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
				>
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<div className="px-4 lg:px-6">
								<ChartAreaInteractive title="Revenus" data={missionsData} />
							</div>
						</div>
					</div>
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<div className="px-4 lg:px-6">
								{/* Afficher toutes les missions de chartData*/}
								<div className="space-y-3">
									{chartData.map((mission, idx) => (
										<div key={idx} className="bg-card rounded-lg border p-4">
											<Link href={`/accounting/${mission.id}`} passHref>
												<div className="grid grid-cols-3 gap-4">
													<div>
														<p className="text-muted-foreground text-sm">
															Date
														</p>
														<p className="font-medium">
															{formatDate(new Date(mission.date))}
														</p>
													</div>
													<div>
														<p className="text-muted-foreground text-sm">
															Prix Total
														</p>
														<p className="font-medium">
															{mission.price}€
														</p>
													</div>
													<div>
														<p className="text-muted-foreground text-sm">
															Pièces
														</p>
														<p className="text-sm">
															{mission.parts?.length || 0} article(s)
														</p>
													</div>
												</div>
											</Link>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
