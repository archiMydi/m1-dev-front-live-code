"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { useState } from "react";
import { toast } from "sonner";
import { customers } from "@/app/customers/data"; // liste de clients fictifs (mockup dans vue client) si besoin

interface CreateVehicleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultOwnerId?: string; // pré-rempli le propriétaire si on vient de la page détail client
}

export function CreateVehicleDialog({
	open,
	onOpenChange,
	defaultOwnerId,
}: CreateVehicleDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		plate: "",
		brand: "",
		model: "",
		vin: "",
		ownerId: defaultOwnerId || "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulation d'un appel API
		setTimeout(() => {
			setIsLoading(false);
			toast.success("Véhicule créé avec succès (MOCK)");
			onOpenChange(false);
			// Reset form mais garder le owner si fourni par défaut
			setFormData({
				plate: "",
				brand: "",
				model: "",
				vin: "",
				ownerId: defaultOwnerId || "",
			});
		}, 1000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>Nouveau Véhicule</DialogTitle>
					<DialogDescription>Ajouter un nouveau véhicule au parc.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="plate">Immatriculation</Label>
							<Input
								id="plate"
								placeholder="AA-123-BB"
								required
								value={formData.plate}
								onChange={(e) =>
									setFormData({
										...formData,
										plate: e.target.value.toUpperCase(),
									})
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="vin">VIN</Label>
							<Input
								id="vin"
								required
								value={formData.vin}
								onChange={(e) =>
									setFormData({ ...formData, vin: e.target.value.toUpperCase() })
								}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="brand">Marque</Label>
							<Input
								id="brand"
								placeholder="Peugeot"
								required
								value={formData.brand}
								onChange={(e) =>
									setFormData({ ...formData, brand: e.target.value })
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="model">Modèle</Label>
							<Input
								id="model"
								placeholder="208"
								required
								value={formData.model}
								onChange={(e) =>
									setFormData({ ...formData, model: e.target.value })
								}
							/>
						</div>
					</div>

					{/* Sélection du propriétaire (si non pré-rempli) */}
					{!defaultOwnerId && (
						<div className="grid gap-2">
							<Label htmlFor="owner">Propriétaire</Label>
							<Select
								value={formData.ownerId}
								onValueChange={(value) =>
									setFormData({ ...formData, ownerId: value })
								}
							>
								<SelectTrigger id="owner">
									<SelectValue placeholder="Sélectionner un client" />
								</SelectTrigger>
								<SelectContent>
									{customers.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.firstName} {c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Création..." : "Créer le véhicule"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
