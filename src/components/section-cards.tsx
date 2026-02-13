"use client";

import { IconCalendar, IconTrophy, IconStar } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";

const MOCK_EMPLOYE_DU_MOIS = {
	nom: "Jean Dupont",
	missions: 120,
	periode: "Février 2026",
};

function formatDate(isoDate: string): string {
	const date = new Date(isoDate);
	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);

	const isToday = date.toDateString() === today.toDateString();
	const isTomorrow = date.toDateString() === tomorrow.toDateString();

	if (isToday) return "Aujourd'hui";
	if (isTomorrow) return "Demain";

	return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function formatTime(isoDate: string): string {
	return new Date(isoDate).toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatStatus(status: string): string {
	const statusMap: Record<string, string> = {
		planned: "Planifié",
		"in-progress": "En cours",
		completed: "Terminé",
		cancelled: "Annulé",
	};
	return statusMap[status] ?? status;
}

export function SectionCards() {
	const { data: missions, isLoading: missionsLoading } = trpc.missions.list.useQuery();

	const { data: customers, isLoading: customersLoading } = trpc.customers.search.useQuery({
		q: "",
	});

	const upcomingMissions =
		missions?.filter((m) => m.status === "planned" || m.status === "in-progress").slice(0, 5) ??
		[];

	const firstClient = customers?.[0] ?? null;

	return (
		<div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
			<Card className="@xl/main:col-span-2 @5xl/main:col-span-1">
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconCalendar className="text-muted-foreground size-5" />
						<CardDescription>Prochains rendez-vous</CardDescription>
					</div>
					<CardTitle className="text-2xl font-semibold">
						{missionsLoading ? "..." : `${upcomingMissions.length} à venir`}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{missionsLoading ? (
						<p className="text-muted-foreground text-sm">Chargement...</p>
					) : upcomingMissions.length === 0 ? (
						<p className="text-muted-foreground text-sm">Aucune mission à venir</p>
					) : (
						upcomingMissions.map((mission, index) => (
							<div key={mission.id}>
								{index > 0 && <Separator className="mb-3" />}
								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0 flex-1 space-y-0.5">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">
												{formatDate(mission.start)} à{" "}
												{formatTime(mission.start)}
											</p>
											<Badge
												variant={
													mission.status === "in-progress"
														? "default"
														: "outline"
												}
												className="text-xs"
											>
												{formatStatus(mission.status)}
											</Badge>
										</div>
										<p className="text-sm">{mission.title}</p>
										<p className="text-muted-foreground text-xs">
											Client #{mission.customerId} — Véhicule #
											{mission.vehicleId}
										</p>
									</div>
								</div>
							</div>
						))
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconTrophy className="text-muted-foreground size-5" />
						<CardDescription>Employé du mois</CardDescription>
					</div>
					<CardTitle className="text-2xl font-semibold">
						{MOCK_EMPLOYE_DU_MOIS.nom}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1 text-sm">
					<p>
						<span className="text-muted-foreground">Missions réalisées : </span>
						{MOCK_EMPLOYE_DU_MOIS.missions}
					</p>
					<p>
						<span className="text-muted-foreground">Période : </span>
						{MOCK_EMPLOYE_DU_MOIS.periode}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconStar className="text-muted-foreground size-5" />
						<CardDescription>Meilleur client</CardDescription>
						{customers && (
							<Badge variant="outline" className="ml-auto text-xs">
								{customers.length} clients
							</Badge>
						)}
					</div>
					<CardTitle className="text-2xl font-semibold">
						{customersLoading
							? "Chargement..."
							: firstClient
								? `${firstClient.firstName} ${firstClient.name}`
								: "Aucun client"}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1 text-sm">
					{firstClient && (
						<>
							<p>
								<span className="text-muted-foreground">Ville : </span>
								{firstClient.city}
							</p>
							<p>
								<span className="text-muted-foreground">Véhicules : </span>
								{firstClient.vehicles.length}
							</p>
						</>
					)}
					<p>
						<span className="text-muted-foreground">Période : </span>
						Février 2026
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
