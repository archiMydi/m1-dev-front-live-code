"use client";

import { useState } from "react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { InitialDateTime } from "@/components/appointments-calendar";

type Vehicle = { id: number; plate: string; model: string };
type User = { id: number; name: string };
type Customer = { id: number; name: string };
type Part = { id: number; name: string; price: number };

interface AppointmentsModalProps {
	initialDateTime: InitialDateTime;
	vehicles: Vehicle[];
	users: User[];
	customers: Customer[];
	parts: Part[];
	onClose: () => void;
}

export default function AppointmentsModal({
	initialDateTime,
	vehicles,
	users,
	customers,
	parts,
	onClose,
}: AppointmentsModalProps) {
	const formatDate = (date: Date) => date.toISOString().split("T")[0];
	const formatTime = (date: Date) =>
		`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

	const [formData, setFormData] = useState({
		title: "",
		vehicleId: "",
		userId: "",
		customerId: "",
		startDate: initialDateTime ? formatDate(initialDateTime.startDate) : "",
		startTime: initialDateTime ? formatTime(initialDateTime.startDate) : "09:00",
		endDate: initialDateTime ? formatDate(initialDateTime.endDate) : "",
		endTime: initialDateTime ? formatTime(initialDateTime.endDate) : "10:00",
		selectedParts: [] as number[],
		totalPrice: "",
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleAddPart = (partId: string) => {
		const id = parseInt(partId);
		if (!formData.selectedParts.includes(id)) {
			const newParts = [...formData.selectedParts, id];
			const totalPrice = newParts.reduce((sum, pId) => {
				const part = parts.find((p) => p.id === pId);
				return sum + (part?.price || 0);
			}, 0);
			setFormData({
				...formData,
				selectedParts: newParts,
				totalPrice: totalPrice.toFixed(2),
			});
		}
	};

	const handleRemovePart = (partId: number) => {
		const newParts = formData.selectedParts.filter((id) => id !== partId);
		const totalPrice = newParts.reduce((sum, pId) => {
			const part = parts.find((p) => p.id === pId);
			return sum + (part?.price || 0);
		}, 0);
		setFormData({
			...formData,
			selectedParts: newParts,
			totalPrice: totalPrice.toFixed(2),
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.title ||
			!formData.vehicleId ||
			!formData.userId ||
			!formData.customerId ||
			!formData.startDate ||
			!formData.endDate
		) {
			alert("Veuillez remplir tous les champs obligatoires");
			return;
		}

		setIsLoading(true);

		const missionData = {
			title: formData.title,
			vehicleId: parseInt(formData.vehicleId),
			userId: parseInt(formData.userId),
			customerId: parseInt(formData.customerId),
			startDate: new Date(`${formData.startDate}T${formData.startTime}`),
			endDate: new Date(`${formData.endDate}T${formData.endTime}`),
			parts: formData.selectedParts,
			totalPrice: parseFloat(formData.totalPrice) || 0,
		};

		console.log("Mission data:", missionData);
		// TODO: Envoyer missionData à l'API

		setIsLoading(false);
		onClose();
	};

	return (
		<DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
			<DialogHeader>
				<DialogTitle>Créer une nouvelle mission</DialogTitle>
				<DialogDescription>Remplissez les informations de la mission</DialogDescription>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Titre */}
				<div className="space-y-2">
					<Label htmlFor="title">Titre de la mission *</Label>
					<Input
						id="title"
						placeholder="Ex: Vidange + Filtres"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						required
					/>
				</div>

				{/* Véhicule */}
				<div className="w-full space-y-2">
					<Label htmlFor="vehicle">Véhicule *</Label>
					<Select
						value={formData.vehicleId}
						onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
					>
						<SelectTrigger id="vehicle" className="w-full">
							<SelectValue placeholder="Sélectionner un véhicule" />
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
				<div className="w-full space-y-2">
					<Label htmlFor="user">Technicien *</Label>
					<Select
						value={formData.userId}
						onValueChange={(value) => setFormData({ ...formData, userId: value })}
					>
						<SelectTrigger id="user" className="w-full">
							<SelectValue placeholder="Sélectionner un technicien" />
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
				<div className="w-full space-y-2">
					<Label htmlFor="customer">Client *</Label>
					<Select
						value={formData.customerId}
						onValueChange={(value) => setFormData({ ...formData, customerId: value })}
					>
						<SelectTrigger id="customer" className="w-full">
							<SelectValue placeholder="Sélectionner un client" />
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
						<Label htmlFor="startDate">Date début *</Label>
						<Input
							id="startDate"
							type="date"
							value={formData.startDate}
							onChange={(e) =>
								setFormData({ ...formData, startDate: e.target.value })
							}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="startTime">Heure début *</Label>
						<Input
							id="startTime"
							type="time"
							value={formData.startTime}
							onChange={(e) =>
								setFormData({ ...formData, startTime: e.target.value })
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
							value={formData.endDate}
							onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="endTime">Heure fin *</Label>
						<Input
							id="endTime"
							type="time"
							value={formData.endTime}
							onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
							required
						/>
					</div>
				</div>

				{/* Pièces */}
				<div className="w-full space-y-2">
					<Label>Pièces nécessaires</Label>
					<Select onValueChange={handleAddPart}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Ajouter une pièce" />
						</SelectTrigger>
						<SelectContent>
							{parts
								.filter((p) => !formData.selectedParts.includes(p.id))
								.map((p) => (
									<SelectItem key={p.id} value={p.id.toString()}>
										{p.name} - {p.price.toFixed(2)} €
									</SelectItem>
								))}
						</SelectContent>
					</Select>

					{formData.selectedParts.length > 0 && (
						<div className="mt-2 space-y-1">
							{formData.selectedParts.map((partId) => {
								const part = parts.find((p) => p.id === partId);
								return (
									<div
										key={partId}
										className="bg-muted flex items-center justify-between rounded px-2 py-1 text-sm"
									>
										<span>
											{part?.name} - {part?.price.toFixed(2)} €
										</span>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0"
											onClick={() => handleRemovePart(partId)}
										>
											✕
										</Button>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Prix total */}
				<div className="space-y-2">
					<Label htmlFor="totalPrice">Prix total (€)</Label>
					<Input
						id="totalPrice"
						type="number"
						step="0.01"
						placeholder="0.00"
						value={formData.totalPrice}
						onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
					/>
				</div>

				{/* Boutons */}
				<div className="flex gap-2 pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1"
					>
						Annuler
					</Button>
					<Button type="submit" disabled={isLoading} className="flex-1">
						{isLoading ? "Création..." : "Créer la mission"}
					</Button>
				</div>
			</form>
		</DialogContent>
	);
}
