"use client";

import { useState, useRef } from "react";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { trpc } from "@/trpc/client";
import { Day } from "react-day-picker";

const vehicles = [
	{ id: 1, name: "Toyota Corolla (VIN123456)" },
	{ id: 2, name: "Peugeot 308 (VIN789012)" },
];

export default function AppointmentsCalendar() {
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [createDateTime, setCreateDateTime] = useState<{
		date: Date;
		hour: number;
		minute: number;
	} | null>(null);
	const calendarRef = useRef<DayPilotCalendar>(null);

	const handleTimeRangeSelect = (args: any) => {
		const startDate = args.start.toDate();
		const hour = startDate.getHours();
		const minute = startDate.getMinutes();

		setCreateDateTime({
			date: startDate,
			hour,
			minute,
		});
		setShowCreateDialog(true);
	};

	return (
		<div className="w-full space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Planning des Missions</h1>
				<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
					<DialogTrigger asChild>
						<Button>Nouvelle Mission</Button>
					</DialogTrigger>
					<CreateMissionDialog
						initialDateTime={createDateTime}
						onClose={() => {
							setShowCreateDialog(false);
							setCreateDateTime(null);
						}}
						onSuccess={() => {
							setShowCreateDialog(false);
							setCreateDateTime(null);
						}}
					/>
				</Dialog>
			</div>

			<DayPilotCalendar
				ref={calendarRef}
				viewType="Week"
				locale="fr-fr"
				events={[]}
				onTimeRangeSelect={handleTimeRangeSelect}
				startDate={DayPilot.Date.today()}
				durationBarVisible={false}
				cellHeight={80}
				dayBeginsHour={9}
				dayEndsHour={18}
			/>
		</div>
	);
}

function CreateMissionDialog({
	initialDateTime,
	onClose,
	onSuccess,
}: {
	initialDateTime: {
		date: Date;
		hour: number;
		minute: number;
	} | null;
	onClose: () => void;
	onSuccess: () => void;
}) {
	const createMissionMutation = trpc.missions.create.useMutation();

	// Initialiser les heures de fin (start + 1h)
	const getDefaultEndTime = () => {
		if (!initialDateTime) return "10:00";
		const endHour = (initialDateTime.hour + 1) % 24;
		return `${String(endHour).padStart(2, "0")}:${String(initialDateTime.minute).padStart(2, "0")}`;
	};

	const [formData, setFormData] = useState({
		vehicleId: "",
		startDate: initialDateTime?.date.toISOString().split("T")[0] || "",
		startTime: initialDateTime
			? `${String(initialDateTime.hour).padStart(2, "0")}:${String(initialDateTime.minute).padStart(2, "0")}`
			: "09:00",
		endDate: initialDateTime?.date.toISOString().split("T")[0] || "",
		endTime: getDefaultEndTime(),
		totalPrice: "",
		parts: [] as { name: string; price: string }[],
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleAddPart = () => {
		setFormData({
			...formData,
			parts: [...formData.parts, { name: "", price: "" }],
		});
	};

	const handleRemovePart = (index: number) => {
		setFormData({
			...formData,
			parts: formData.parts.filter((_, i) => i !== index),
		});
	};

	const handlePartChange = (index: number, field: "name" | "price", value: string) => {
		const newParts = [...formData.parts];
		newParts[index] = { ...newParts[index], [field]: value };
		setFormData({ ...formData, parts: newParts });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.vehicleId ||
			!formData.startDate ||
			!formData.endDate ||
			!formData.totalPrice
		) {
			alert("Veuillez remplir tous les champs obligatoires");
			return;
		}

		try {
			setIsLoading(true);

			const startDate = new Date(`${formData.startDate}T${formData.startTime}`);
			const endDate = new Date(`${formData.endDate}T${formData.endTime}`);

			createMissionMutation.mutate(
				{
					vehicleId: parseInt(formData.vehicleId),
					startDate,
					endDate,
					totalPrice: parseFloat(formData.totalPrice),
				},
				{ onSuccess },
			);
		} catch (error) {
			console.error("Erreur lors de la création:", error);
			alert("Erreur lors de la création de la mission");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
			<DialogHeader>
				<DialogTitle>Créer une nouvelle mission</DialogTitle>
				<DialogDescription>Remplissez les informations de la mission</DialogDescription>
			</DialogHeader>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Véhicule */}
				<div className="space-y-2">
					<Label htmlFor="vehicle">Véhicule *</Label>
					<Select
						value={formData.vehicleId}
						onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}
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
				<div className="space-y-2">
					<Label>Pièces nécessaires</Label>
					<div className="max-h-40 space-y-2 overflow-y-auto">
						{formData.parts.map((part, index) => (
							<div key={index} className="flex gap-2">
								<Input
									placeholder="Nom de la pièce"
									value={part.name}
									onChange={(e) =>
										handlePartChange(index, "name", e.target.value)
									}
									className="flex-1"
								/>
								<Input
									placeholder="Prix"
									type="number"
									step="0.01"
									value={part.price}
									onChange={(e) =>
										handlePartChange(index, "price", e.target.value)
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
						value={formData.totalPrice}
						onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
						required
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
						{isLoading ? "Création..." : "Créer"}
					</Button>
				</div>
			</form>
		</DialogContent>
	);
}
