"user client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { initialCreateGarageFormData, type CreateGarageFormData } from "@/app/garage/data";

interface CreateGarageDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateGarageDialog({ open, onOpenChange }: CreateGarageDialogProps) {
	const [formData, setFormData] = useState<CreateGarageFormData>(initialCreateGarageFormData);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (field: keyof CreateGarageFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// TODO: Appel API tRPC pour créer le garage
		console.log("Création du garage:", formData);

		// Simuler un délai
		setTimeout(() => {
			setIsLoading(false);
			onOpenChange(false);
			// Reset du formulaire avec les valeurs initiales
			setFormData(initialCreateGarageFormData);
		}, 1000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-2xl">
				<DialogHeader>
					<DialogTitle>Créer un nouveau garage</DialogTitle>
					<DialogDescription>
						Remplissez les informations légales de votre garage
					</DialogDescription>
				</DialogHeader>

				{/* Zone scrollable pour le formulaire */}
				<ScrollArea className="max-h-[60vh] pr-4">
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Section : Informations générales */}
						<div className="space-y-4">
							<h3 className="text-sm font-semibold">Informations générales</h3>

							{/* Nom du garage */}
							<div className="space-y-2">
								<Label htmlFor="name">Nom du garage *</Label>
								<Input
									id="name"
									placeholder="Ex: Garage Central Paris"
									value={formData.name}
									onChange={(e) => handleChange("name", e.target.value)}
									required
								/>
							</div>

							{/* Adresse */}
							<div className="space-y-2">
								<Label htmlFor="address">Adresse complète *</Label>
								<Input
									id="address"
									placeholder="12 rue de la Paix, 75002 Paris"
									value={formData.address}
									onChange={(e) => handleChange("address", e.target.value)}
									required
								/>
							</div>

							{/* Téléphone et Email sur la même ligne */}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="phone">Téléphone *</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="01 23 45 67 89"
										value={formData.phone}
										onChange={(e) => handleChange("phone", e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email *</Label>
									<Input
										id="email"
										type="email"
										placeholder="contact@garage.fr"
										value={formData.email}
										onChange={(e) => handleChange("email", e.target.value)}
										required
									/>
								</div>
							</div>
						</div>

						{/* Section : Informations légales */}
						<div className="space-y-4 border-t pt-4">
							<h3 className="text-sm font-semibold">Informations légales</h3>

							{/* SIRET */}
							<div className="space-y-2">
								<Label htmlFor="siret">SIRET *</Label>
								<Input
									id="siret"
									placeholder="123 456 789 00012"
									value={formData.siret}
									onChange={(e) => handleChange("siret", e.target.value)}
									required
									maxLength={17}
								/>
								<p className="text-muted-foreground text-xs">
									14 chiffres (espaces optionnels)
								</p>
							</div>

							{/* Code comptable */}
							<div className="space-y-2">
								<Label htmlFor="codeComptable">Code comptable *</Label>
								<Input
									id="codeComptable"
									placeholder="Ex: 411000"
									value={formData.codeComptable}
									onChange={(e) => handleChange("codeComptable", e.target.value)}
									required
								/>
							</div>

							{/* Forme juridique et Code APE sur la même ligne */}
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="formeJuridique">Forme juridique</Label>
									<Input
										id="formeJuridique"
										placeholder="Ex: SARL, SAS..."
										value={formData.formeJuridique}
										onChange={(e) =>
											handleChange("formeJuridique", e.target.value)
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="ape">Code APE</Label>
									<Input
										id="ape"
										placeholder="Ex: 4520A"
										value={formData.ape}
										onChange={(e) => handleChange("ape", e.target.value)}
									/>
								</div>
							</div>
						</div>

						{/* Section : Personnalisation (optionnelle) */}
						<div className="space-y-4 border-t pt-4">
							<h3 className="text-sm font-semibold">Personnalisation (optionnel)</h3>

							{/* URL du logo */}
							<div className="space-y-2">
								<Label htmlFor="logoUrl">URL du logo</Label>
								<Input
									id="logoUrl"
									type="url"
									placeholder="https://example.com/logo.png"
									value={formData.logoUrl}
									onChange={(e) => handleChange("logoUrl", e.target.value)}
								/>
								<p className="text-muted-foreground text-xs">
									Lien vers le logo de votre garage
								</p>
							</div>
						</div>
					</form>
				</ScrollArea>

				{/* Boutons en bas */}
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							setFormData(initialCreateGarageFormData);
						}}
					>
						Annuler
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? "Création..." : "Créer le garage"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
