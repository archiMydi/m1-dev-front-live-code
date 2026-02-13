"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User, Car, Wrench, Euro } from "lucide-react";

// TODO: Remplacer par un vrai fetch depuis la BDD
const missions = [
	{
		id: 1,
		title: "Vidange + Filtres",
		vehicleId: 1,
		userId: 1,
		customerId: 1,
		start: "2026-02-13T09:00:00",
		end: "2026-02-13T11:00:00",
		parts: [1, 2],
		totalPrice: 79.98,
		status: "planned",
	},
	{
		id: 2,
		title: "Changement plaquettes",
		vehicleId: 2,
		userId: 2,
		customerId: 2,
		start: "2026-02-13T13:00:00",
		end: "2026-02-13T15:00:00",
		parts: [2],
		totalPrice: 49.99,
		status: "in-progress",
	},
];

const users = [
	{ id: 1, name: "Alice Dupont" },
	{ id: 2, name: "Bob Martin" },
	{ id: 3, name: "Charlie Durand" },
];

const customers = [
	{ id: 1, name: "Jean Lefèvre" },
	{ id: 2, name: "Marie Blanc" },
	{ id: 3, name: "Pierre Noir" },
];

const vehicles = [
	{ id: 1, plate: "AB-123-CD", model: "Toyota Corolla" },
	{ id: 2, plate: "EF-456-GH", model: "Peugeot 308" },
];

const parts = [
	{ id: 1, name: "Filtre à huile", price: 29.99 },
	{ id: 2, name: "Plaquettes de frein", price: 49.99 },
	{ id: 3, name: "Batterie", price: 89.99 },
];

const statusLabels: Record<
	string,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	planned: { label: "Planifiée", variant: "outline" },
	"in-progress": { label: "En cours", variant: "default" },
	completed: { label: "Terminée", variant: "secondary" },
	cancelled: { label: "Annulée", variant: "destructive" },
};

export default function MissionDetails() {
	const params = useParams();
	const router = useRouter();
	const missionId = parseInt(params.id as string);

	const mission = missions.find((m) => m.id === missionId);

	if (!mission) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-12">
				<h1 className="text-2xl font-bold">Mission non trouvée</h1>
				<Button onClick={() => router.push("/appointments")} variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Retour au planning
				</Button>
			</div>
		);
	}

	const user = users.find((u) => u.id === mission.userId);
	const customer = customers.find((c) => c.id === mission.customerId);
	const vehicle = vehicles.find((v) => v.id === mission.vehicleId);
	const missionParts = mission.parts
		.map((pId) => parts.find((p) => p.id === pId))
		.filter(Boolean);

	const startDate = new Date(mission.start);
	const endDate = new Date(mission.end);

	const formatDate = (date: Date) =>
		date.toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	const formatTime = (date: Date) =>
		date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

	const status = statusLabels[mission.status] || statusLabels.planned;

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button onClick={() => router.push("/appointments")} variant="ghost" size="icon">
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div className="flex-1">
					<h1 className="text-3xl font-bold">{mission.title}</h1>
					<p className="text-muted-foreground">Mission #{mission.id}</p>
				</div>
				<Badge variant={status.variant}>{status.label}</Badge>
			</div>

			{/* Mission Info */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Date & Heure */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Calendar className="h-5 w-5" />
							Date & Horaires
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<p className="capitalize">{formatDate(startDate)}</p>
						<p className="text-muted-foreground flex items-center gap-2">
							<Clock className="h-4 w-4" />
							{formatTime(startDate)} - {formatTime(endDate)}
						</p>
					</CardContent>
				</Card>

				{/* Technicien */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-lg">
							<User className="h-5 w-5" />
							Technicien
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-medium">{user?.name || "Non assigné"}</p>
					</CardContent>
				</Card>

				{/* Client */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-lg">
							<User className="h-5 w-5" />
							Client
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-medium">{customer?.name || "N/A"}</p>
					</CardContent>
				</Card>

				{/* Véhicule */}
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Car className="h-5 w-5" />
							Véhicule
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-medium">{vehicle?.model || "N/A"}</p>
						<p className="text-muted-foreground">{vehicle?.plate || "N/A"}</p>
					</CardContent>
				</Card>
			</div>

			{/* Pièces */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wrench className="h-5 w-5" />
						Pièces utilisées
					</CardTitle>
					<CardDescription>
						{missionParts.length} pièce{missionParts.length > 1 ? "s" : ""}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{missionParts.length > 0 ? (
						<div className="space-y-2">
							{missionParts.map((part) => (
								<div
									key={part!.id}
									className="bg-muted flex justify-between rounded-md px-3 py-2"
								>
									<span>{part!.name}</span>
									<span className="font-medium">{part!.price.toFixed(2)} €</span>
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">Aucune pièce enregistrée</p>
					)}
				</CardContent>
			</Card>

			{/* Prix total */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Euro className="h-5 w-5" />
						Prix total
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-3xl font-bold">{mission.totalPrice.toFixed(2)} €</p>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex gap-4">
				<Button variant="outline" className="flex-1">
					Modifier
				</Button>
				<Button variant="destructive" className="flex-1">
					Supprimer
				</Button>
			</div>
		</div>
	);
}
