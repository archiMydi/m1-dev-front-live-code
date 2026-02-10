"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { appointmentsService, Mission } from "@/app/services/appointments.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const vehicles = [
	{ id: 1, name: "Toyota Corolla (VIN123456)" },
	{ id: 2, name: "Peugeot 308 (VIN789012)" },
];

export default function MissionDetails() {
	const params = useParams();
	const router = useRouter();
	const [mission, setMission] = useState<Mission | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editFormData, setEditFormData] = useState({
		vehicleId: "",
		startDate: "",
		startTime: "",
		endDate: "",
		endTime: "",
		totalPrice: "",
		parts: [] as { id?: number; name: string; price: string }[],
	});

	const missionId = parseInt(params.id as string);

	useEffect(() => {
		loadMission();
	}, [missionId]);

	const loadMission = async () => {
		try {
			setLoading(true);
			const data = await appointmentsService.getById(missionId);
			if (data) {
				setMission(data);
				initializeEditForm(data);
			}
		} catch (error) {
			console.error("Erreur lors du chargement:", error);
		} finally {
			setLoading(false);
		}
	};

	const initializeEditForm = (m: Mission) => {
		const startDate = new Date(m.startDate);
		const endDate = new Date(m.endDate);

		setEditFormData({
			vehicleId: m.vehicleId.toString(),
			startDate: startDate.toISOString().split("T")[0],
			startTime: `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`,
			endDate: endDate.toISOString().split("T")[0],
			endTime: `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`,
			totalPrice: m.totalPrice.toString(),
			parts: m.parts.map((p) => ({
				id: p.id,
				name: p.name,
				price: p.price.toString(),
			})),
		});
	};

	const handleUpdateMission = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!editFormData.vehicleId ||
			!editFormData.startDate ||
			!editFormData.endDate ||
			!editFormData.totalPrice
		) {
			alert("Veuillez remplir tous les champs obligatoires");
			return;
		}

		try {
			const startDate = new Date(`${editFormData.startDate}T${editFormData.startTime}`);
			const endDate = new Date(`${editFormData.endDate}T${editFormData.endTime}`);

			await appointmentsService.update(missionId, {
				startDate,
				endDate,
				vehicleId: parseInt(editFormData.vehicleId),
				totalPrice: parseFloat(editFormData.totalPrice),
				parts: editFormData.parts.map((part) => ({
					name: part.name || "Sans nom",
					price: parseFloat(part.price) || 0,
				})),
			});

			await loadMission();
			setIsEditing(false);
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			alert("Erreur lors de la mise à jour de la mission");
		}
	};

	const handleDeleteMission = async () => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) {
			return;
		}

		try {
			await appointmentsService.delete(missionId);
			router.push("/appointments");
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			alert("Erreur lors de la suppression de la mission");
		}
	};

	const handleAddPart = () => {
		setEditFormData({
			...editFormData,
			parts: [...editFormData.parts, { name: "", price: "" }],
		});
	};

	const handleRemovePart = (index: number) => {
		setEditFormData({
			...editFormData,
			parts: editFormData.parts.filter((_, i) => i !== index),
		});
	};

	const handlePartChange = (index: number, field: "name" | "price", value: string) => {
		const newParts = [...editFormData.parts];
		newParts[index] = { ...newParts[index], [field]: value };
		setEditFormData({ ...editFormData, parts: newParts });
	};

	if (loading) {
		return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
	}

	if (!mission) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold">Mission non trouvée</h1>
				<Link href="/appointments">
					<Button>Retour au calendrier</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<Link
						href="/appointments"
						className="mb-2 inline-block text-blue-600 hover:underline"
					>
						← Retour au calendrier
					</Link>
					<h1 className="text-3xl font-bold">
						Mission #{mission.id} - {mission.vehicle?.marque} {mission.vehicle?.model}
					</h1>
				</div>

				<div className="flex gap-2">
					<Dialog open={isEditing} onOpenChange={setIsEditing}>
						<DialogTrigger asChild>
							<Button variant="outline">Modifier</Button>
						</DialogTrigger>
						<DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
							<DialogHeader>
								<DialogTitle>Modifier la mission</DialogTitle>
								<DialogDescription>
									Mettez à jour les informations de la mission
								</DialogDescription>
							</DialogHeader>

							<form onSubmit={handleUpdateMission} className="space-y-4">
								{/* Véhicule */}
								<div className="space-y-2">
									<Label htmlFor="vehicle">Véhicule *</Label>
									<Select
										value={editFormData.vehicleId}
										onValueChange={(value) =>
											setEditFormData({
												...editFormData,
												vehicleId: value,
											})
										}
									>
										<SelectTrigger id="vehicle">
											<SelectValue placeholder="Sélectionner un véhicule" />
										</SelectTrigger>
										<SelectContent>
											{vehicles.map((v) => (
												<SelectItem key={v.id} value={v.id.toString()}>
													{v.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Date et heure de début */}
								<div className="grid grid-cols-2 gap-2">
									<div className="space-y-2">
										<Label htmlFor="startDate">Date début *</Label>
										<Input
											id="startDate"
											type="date"
											value={editFormData.startDate}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													startDate: e.target.value,
												})
											}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="startTime">Heure début *</Label>
										<Input
											id="startTime"
											type="time"
											value={editFormData.startTime}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													startTime: e.target.value,
												})
											}
											required
										/>
									</div>
								</div>

								{/* Date et heure de fin */}
								<div className="grid grid-cols-2 gap-2">
									<div className="space-y-2">
										<Label htmlFor="endDate">Date fin *</Label>
										<Input
											id="endDate"
											type="date"
											value={editFormData.endDate}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													endDate: e.target.value,
												})
											}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="endTime">Heure fin *</Label>
										<Input
											id="endTime"
											type="time"
											value={editFormData.endTime}
											onChange={(e) =>
												setEditFormData({
													...editFormData,
													endTime: e.target.value,
												})
											}
											required
										/>
									</div>
								</div>

								{/* Pièces */}
								<div className="space-y-2">
									<Label>Pièces nécessaires</Label>
									<div className="max-h-40 space-y-2 overflow-y-auto">
										{editFormData.parts.map((part, index) => (
											<div key={index} className="flex gap-2">
												<Input
													placeholder="Nom de la pièce"
													value={part.name}
													onChange={(e) =>
														handlePartChange(
															index,
															"name",
															e.target.value,
														)
													}
													className="flex-1"
												/>
												<Input
													placeholder="Prix"
													type="number"
													step="0.01"
													value={part.price}
													onChange={(e) =>
														handlePartChange(
															index,
															"price",
															e.target.value,
														)
													}
													className="w-20"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => handleRemovePart(index)}
												>
													✕
												</Button>
											</div>
										))}
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleAddPart}
										className="w-full"
									>
										+ Ajouter une pièce
									</Button>
								</div>

								{/* Prix total */}
								<div className="space-y-2">
									<Label htmlFor="totalPrice">Prix total *</Label>
									<Input
										id="totalPrice"
										type="number"
										step="0.01"
										placeholder="0.00"
										value={editFormData.totalPrice}
										onChange={(e) =>
											setEditFormData({
												...editFormData,
												totalPrice: e.target.value,
											})
										}
										required
									/>
								</div>

								{/* Boutons */}
								<div className="flex gap-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsEditing(false)}
										className="flex-1"
									>
										Annuler
									</Button>
									<Button type="submit" className="flex-1">
										Mettre à jour
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					<Button variant="destructive" onClick={handleDeleteMission}>
						Supprimer
					</Button>
				</div>
			</div>

			{/* Informations principales */}
			<Card>
				<CardHeader>
					<CardTitle>Informations du véhicule</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div>
						<p className="text-sm text-gray-600">Marque et modèle</p>
						<p className="text-lg font-semibold">
							{mission.vehicle?.marque} {mission.vehicle?.model}
						</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Numéro VIN</p>
						<p className="font-mono text-sm">{mission.vehicle?.vin}</p>
					</div>
				</CardContent>
			</Card>

			{/* Horaires */}
			<Card>
				<CardHeader>
					<CardTitle>Horaires</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-6">
					<div>
						<p className="mb-1 text-sm text-gray-600">Début</p>
						<p className="font-semibold">
							{mission.startDate.toLocaleDateString("fr-FR", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
						<p className="text-lg font-bold text-blue-600">
							{new Date(mission.startDate).toLocaleTimeString("fr-FR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
					<div>
						<p className="mb-1 text-sm text-gray-600">Fin</p>
						<p className="font-semibold">
							{mission.endDate.toLocaleDateString("fr-FR", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
						<p className="text-lg font-bold text-green-600">
							{new Date(mission.endDate).toLocaleTimeString("fr-FR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Pièces */}
			{mission.parts.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Pièces nécessaires</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{mission.parts.map((part, index) => (
								<div
									key={part.id}
									className="flex items-center justify-between border-b pb-3 last:border-b-0"
								>
									<div>
										<p className="font-semibold">{part.name}</p>
										<p className="text-sm text-gray-600">Pièce #{index + 1}</p>
									</div>
									<p className="text-lg font-bold text-blue-600">
										{part.price.toFixed(2)}€
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Résumé financier */}
			<Card className="border-blue-200 bg-linear-to-r from-blue-50 to-blue-100">
				<CardHeader>
					<CardTitle>Résumé financier</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{mission.parts.length > 0 && (
						<>
							<div className="flex justify-between">
								<span>Nombre de pièces</span>
								<span className="font-semibold">{mission.parts.length}</span>
							</div>
							<div className="flex justify-between">
								<span>Coût des pièces</span>
								<span className="font-semibold">
									{mission.parts.reduce((sum, p) => sum + p.price, 0).toFixed(2)}€
								</span>
							</div>
							<div className="mt-2 border-t pt-2" />
						</>
					)}
					<div className="flex items-center justify-between text-xl">
						<span className="font-bold">Prix total</span>
						<span className="text-3xl font-bold text-blue-600">
							{mission.totalPrice.toFixed(2)}€
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Informations système */}
			<Card className="bg-gray-50">
				<CardHeader>
					<CardTitle className="text-sm">Informations système</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1 text-sm text-gray-600">
					<p>
						Créé le:{" "}
						{mission.createdAt.toLocaleDateString("fr-FR", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
					<p>
						Mis à jour le:{" "}
						{mission.updatedAt.toLocaleDateString("fr-FR", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
