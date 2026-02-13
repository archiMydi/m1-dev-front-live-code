import { IconCalendar, IconTrophy, IconStar } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MOCK_NEXT_RDVS = [
	{
		id: 1,
		date: "Aujourd'hui",
		heure: "14:30",
		vehicule: "Renault Clio V",
		mission: "Vidange + filtres",
		client: "Marie Lambert",
		statut: "En cours",
	},
	{
		id: 2,
		date: "Aujourd'hui",
		heure: "16:00",
		vehicule: "Peugeot 308",
		mission: "Freins avant",
		client: "Pierre Durand",
		statut: "À faire",
	},
	{
		id: 3,
		date: "Demain",
		heure: "09:00",
		vehicule: "Audi A3",
		mission: "Révision complète",
		client: "Sophie Martin",
		statut: "À faire",
	},
	{
		id: 4,
		date: "Demain",
		heure: "11:30",
		vehicule: "Ford Focus",
		mission: "Changement pneus",
		client: "Lucas Bernard",
		statut: "À faire",
	},
	{
		id: 5,
		date: "14/02",
		heure: "08:30",
		vehicule: "Citroën C3",
		mission: "Diagnostic moteur",
		client: "Emma Petit",
		statut: "À faire",
	},
];

const MOCK_EMPLOYE_DU_MOIS = {
	nom: "Jean Dupont",
	missions: 120,
	periode: "Septembre 2025",
};

const MOCK_MEILLEUR_CLIENT = {
	nom: "Sophie Martin",
	visites: 15,
	periode: "Septembre 2025",
};

export function SectionCards() {
	return (
		<div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
			<Card className="@xl/main:col-span-2 @5xl/main:col-span-1">
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconCalendar className="text-muted-foreground size-5" />
						<CardDescription>Prochains rendez-vous</CardDescription>
					</div>
					<CardTitle className="text-2xl font-semibold">
						{MOCK_NEXT_RDVS.length} à venir
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{MOCK_NEXT_RDVS.map((rdv, index) => (
						<div key={rdv.id}>
							{index > 0 && <Separator className="mb-3" />}
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0 flex-1 space-y-0.5">
									<div className="flex items-center gap-2">
										<p className="text-sm font-medium">
											{rdv.date} à {rdv.heure}
										</p>
										<Badge
											variant={
												rdv.statut === "En cours" ? "default" : "outline"
											}
											className="text-xs"
										>
											{rdv.statut}
										</Badge>
									</div>
									<p className="text-sm">{rdv.vehicule}</p>
									<p className="text-muted-foreground text-xs">
										{rdv.mission} — {rdv.client}
									</p>
								</div>
							</div>
						</div>
					))}
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
					</div>
					<CardTitle className="text-2xl font-semibold">
						{MOCK_MEILLEUR_CLIENT.nom}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1 text-sm">
					<p>
						<span className="text-muted-foreground">Visites : </span>
						{MOCK_MEILLEUR_CLIENT.visites}
					</p>
					<p>
						<span className="text-muted-foreground">Période : </span>
						{MOCK_MEILLEUR_CLIENT.periode}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
