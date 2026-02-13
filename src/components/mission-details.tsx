"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, Clock, User, Car, Wrench, Euro } from "lucide-react";
import { trpc } from "@/trpc/client";

const statusLabels: Record<
	string,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	planned: { label: "Planifiée", variant: "outline" },
	"in-progress": { label: "En cours", variant: "default" },
	completed: { label: "Terminée", variant: "secondary" },
	cancelled: { label: "Annulée", variant: "destructive" },
};

export default function MissionDetails({ backURL = "/appointments" }: { backURL?: string }) {
	const params = useParams();
	const router = useRouter();
	const missionId = parseInt(params.id as string);
	const [isEditing, setIsEditing] = useState(false);
	const [editFormData, setEditFormData] = useState<any>(null);

	// Récupérer les données depuis tRPC
	const { data: mission, isLoading: missionLoading } = trpc.missions.getById.useQuery(
		{ id: missionId },
		{ enabled: !isNaN(missionId) },
	);
	const { data: vehicles = [] } = trpc.vehicles.list.useQuery();
	const { data: users = [] } = trpc.users.list.useQuery();
	const { data: customers = [] } = trpc.customers.list.useQuery();
	const { data: parts = [] } = trpc.parts.list.useQuery();

	const updateMission = trpc.missions.update.useMutation();
	const utils = trpc.useUtils();

	const formatDateForInput = (isoString: string) => isoString.split("T")[0];
	const formatTimeForInput = (isoString: string) => {
		const date = new Date(isoString);
		return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
	};

	const toUTCDateTime = (dateStr: string, timeStr: string): string => {
		const date = new Date(`${dateStr}T${timeStr}`);
		const correctedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return correctedDate.toISOString();
	};

	const handleEditClick = () => {
		if (!mission) return;
		setEditFormData({
			title: mission.title,
			vehicleId: mission.vehicleId.toString(),
			userId: mission.userId.toString(),
			customerId: mission.customerId.toString(),
			startDate: formatDateForInput(mission.start),
			startTime: formatTimeForInput(mission.start),
			endDate: formatDateForInput(mission.end),
			endTime: formatTimeForInput(mission.end),
			selectedParts: mission.parts,
			totalPrice: mission.totalPrice.toFixed(2),
			status: mission.status,
		});
		setIsEditing(true);
	};

	const handleSaveEdit = async () => {
		if (!editFormData || !mission) return;

		const userIdNum = parseInt(editFormData.userId);
		const vehicleIdNum = parseInt(editFormData.vehicleId);
		const customerIdNum = parseInt(editFormData.customerId);

		if (
			!editFormData.title ||
			!editFormData.startDate ||
			!editFormData.endDate ||
			isNaN(userIdNum) ||
			isNaN(vehicleIdNum) ||
			isNaN(customerIdNum)
		) {
			alert("Veuillez remplir tous les champs obligatoires");
			return;
		}

		try {
			await updateMission.mutateAsync({
				id: mission.id,
				title: editFormData.title,
				vehicleId: vehicleIdNum,
				userId: userIdNum,
				customerId: customerIdNum,
				start: toUTCDateTime(editFormData.startDate, editFormData.startTime),
				end: toUTCDateTime(editFormData.endDate, editFormData.endTime),
				parts: editFormData.selectedParts,
				totalPrice: parseFloat(editFormData.totalPrice) || 0,
				status: editFormData.status,
			});
			await utils.missions.invalidate();
			setIsEditing(false);
			setEditFormData(null);
		} catch (error) {
			console.error("Erreur mise à jour mission:", error);
			alert("Erreur lors de la mise à jour de la mission");
		}
	};

	if (missionLoading) {
		return (
			<div className="mx-auto max-w-3xl space-y-6">
				<Skeleton className="h-10 w-64" />
				<div className="grid gap-4 md:grid-cols-2">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardHeader className="pb-2">
								<Skeleton className="h-6 w-32" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-4 w-48" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	if (!mission) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-12">
				<h1 className="text-2xl font-bold">Mission non trouvée</h1>
				<Button onClick={() => router.push(backURL)} variant="outline">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Retour au planning
				</Button>
			</div>
		);
	}

	const user = users.find((u) => parseInt(u.id) === mission.userId);
	const customer = customers.find((c) => parseInt(c.id) === mission.customerId);
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
				<Button onClick={() => router.push(backURL)} variant="ghost" size="icon">
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
			{!isEditing ? (
				<div className="flex gap-4">
					<Button variant="outline" className="flex-1" onClick={handleEditClick}>
						Modifier
					</Button>
					<Button variant="destructive" className="flex-1">
						Supprimer
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					{/* Titre */}
					<div className="space-y-2">
						<Label htmlFor="edit-title">Titre de la mission *</Label>
						<Input
							id="edit-title"
							value={editFormData?.title || ""}
							onChange={(e) =>
								setEditFormData({ ...editFormData, title: e.target.value })
							}
						/>
					</div>

					{/* Véhicule */}
					<div className="space-y-2">
						<Label htmlFor="edit-vehicle">Véhicule *</Label>
						<Select
							value={editFormData?.vehicleId || ""}
							onValueChange={(value) =>
								setEditFormData({ ...editFormData, vehicleId: value })
							}
						>
							<SelectTrigger id="edit-vehicle">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{vehicles.map((v) => (
									<SelectItem key={v.id} value={v.id.toString()}>
										{v.plate} - {v.model}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Technicien */}
					<div className="space-y-2">
						<Label htmlFor="edit-user">Technicien *</Label>
						<Select
							value={editFormData?.userId || ""}
							onValueChange={(value) =>
								setEditFormData({ ...editFormData, userId: value })
							}
						>
							<SelectTrigger id="edit-user">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{users.map((u) => (
									<SelectItem key={u.id} value={u.id.toString()}>
										{u.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Client */}
					<div className="space-y-2">
						<Label htmlFor="edit-customer">Client *</Label>
						<Select
							value={editFormData?.customerId || ""}
							onValueChange={(value) =>
								setEditFormData({ ...editFormData, customerId: value })
							}
						>
							<SelectTrigger id="edit-customer">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{customers.map((c) => (
									<SelectItem key={c.id} value={c.id.toString()}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Date et heure de début */}
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="edit-startDate">Date début *</Label>
							<Input
								id="edit-startDate"
								type="date"
								value={editFormData?.startDate || ""}
								onChange={(e) =>
									setEditFormData({ ...editFormData, startDate: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-startTime">Heure début *</Label>
							<Input
								id="edit-startTime"
								type="time"
								value={editFormData?.startTime || ""}
								onChange={(e) =>
									setEditFormData({ ...editFormData, startTime: e.target.value })
								}
							/>
						</div>
					</div>

					{/* Date et heure de fin */}
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="edit-endDate">Date fin *</Label>
							<Input
								id="edit-endDate"
								type="date"
								value={editFormData?.endDate || ""}
								onChange={(e) =>
									setEditFormData({ ...editFormData, endDate: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-endTime">Heure fin *</Label>
							<Input
								id="edit-endTime"
								type="time"
								value={editFormData?.endTime || ""}
								onChange={(e) =>
									setEditFormData({ ...editFormData, endTime: e.target.value })
								}
							/>
						</div>
					</div>

					{/* Statut */}
					<div className="space-y-2">
						<Label htmlFor="edit-status">Statut</Label>
						<Select
							value={editFormData?.status || "planned"}
							onValueChange={(value) =>
								setEditFormData({ ...editFormData, status: value })
							}
						>
							<SelectTrigger id="edit-status">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="planned">Planifiée</SelectItem>
								<SelectItem value="in-progress">En cours</SelectItem>
								<SelectItem value="completed">Terminée</SelectItem>
								<SelectItem value="cancelled">Annulée</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Prix total */}
					<div className="space-y-2">
						<Label htmlFor="edit-totalPrice">Prix total (€)</Label>
						<Input
							id="edit-totalPrice"
							type="number"
							step="0.01"
							value={editFormData?.totalPrice || ""}
							onChange={(e) =>
								setEditFormData({ ...editFormData, totalPrice: e.target.value })
							}
						/>
					</div>

					{/* Boutons */}
					<div className="flex gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsEditing(false);
								setEditFormData(null);
							}}
							disabled={updateMission.isPending}
							className="flex-1"
						>
							Annuler
						</Button>
						<Button
							type="button"
							onClick={handleSaveEdit}
							disabled={updateMission.isPending}
							className="flex-1"
						>
							{updateMission.isPending ? "Sauvegarde..." : "Sauvegarder"}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
