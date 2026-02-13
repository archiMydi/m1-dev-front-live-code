"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface CreateCustomerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateCustomerDialog({ open, onOpenChange }: CreateCustomerDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		tel: "",
		postalCode: "",
		city: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulation d'un appel API
		setTimeout(() => {
			setIsLoading(false);
			toast.success("Client créé avec succès (Mock)");
			onOpenChange(false);
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				tel: "",
				postalCode: "",
				city: "",
			});
		}, 1000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Nouveau Client</DialogTitle>
					<DialogDescription>
						Remplissez les informations du nouveau client.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="firstName">Prénom *</Label>
							<Input
								id="firstName"
								required
								value={formData.firstName}
								onChange={(e) =>
									setFormData({ ...formData, firstName: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Nom *</Label>
							<Input
								id="lastName"
								required
								value={formData.lastName}
								onChange={(e) =>
									setFormData({ ...formData, lastName: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							type="email"
							required
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tel">Téléphone</Label>
						<Input
							id="tel"
							type="tel"
							value={formData.tel}
							onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
						/>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="postalCode">Code Postal</Label>
							<Input
								id="postalCode"
								value={formData.postalCode}
								onChange={(e) =>
									setFormData({ ...formData, postalCode: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="city">Ville</Label>
							<Input
								id="city"
								value={formData.city}
								onChange={(e) => setFormData({ ...formData, city: e.target.value })}
							/>
						</div>
					</div>

					<div className="flex gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
							className="flex-1"
						>
							Annuler
						</Button>
						<Button type="submit" disabled={isLoading} className="flex-1">
							{isLoading ? "Création..." : "Créer le client"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
