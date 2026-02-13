"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogDescription,
	DialogTitle,
	DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const torqueData = [
	{
		categorie: "Roue",
		type: "M12",
		pas: "1.75",
		matiere: "Acier",
		couple: "85 Nm",
		description: "Boulon de roue standard",
	},
	{
		categorie: "Roue",
		type: "M14",
		pas: "2.0",
		matiere: "Acier",
		couple: "135 Nm",
		description: "Boulon de roue renforcé",
	},

	{
		categorie: "Portière",
		type: "M8",
		pas: "1.25",
		matiere: "Acier",
		couple: "25 Nm",
		description: "Charnière de portière",
	},
	{
		categorie: "Portière",
		type: "M10",
		pas: "1.5",
		matiere: "Acier",
		couple: "50 Nm",
		description: "Fixation poignée",
	},

	{
		categorie: "Moteur",
		type: "M8",
		pas: "1.25",
		matiere: "Aluminium",
		couple: "15 Nm",
		description: "Carter d'huile",
	},
	{
		categorie: "Moteur",
		type: "M10",
		pas: "1.5",
		matiere: "Aluminium",
		couple: "30 Nm",
		description: "Culasse (aluminium)",
	},
	{
		categorie: "Moteur",
		type: "M12",
		pas: "1.75",
		matiere: "Acier",
		couple: "85 Nm",
		description: "Volant moteur",
	},
	{
		categorie: "Moteur",
		type: "M14",
		pas: "2.0",
		matiere: "Acier",
		couple: "135 Nm",
		description: "Bielle",
	},

	{
		categorie: "Suspension",
		type: "M10",
		pas: "1.5",
		matiere: "Acier",
		couple: "50 Nm",
		description: "Fixation amortisseur",
	},
	{
		categorie: "Suspension",
		type: "M12",
		pas: "1.75",
		matiere: "Acier",
		couple: "85 Nm",
		description: "Triangle de suspension",
	},
	{
		categorie: "Suspension",
		type: "M16",
		pas: "2.0",
		matiere: "Acier",
		couple: "210 Nm",
		description: "Rotule de suspension",
	},

	{
		categorie: "Freinage",
		type: "M8",
		pas: "1.25",
		matiere: "Acier",
		couple: "25 Nm",
		description: "Étrier de frein",
	},
	{
		categorie: "Freinage",
		type: "M10",
		pas: "1.5",
		matiere: "Acier",
		couple: "50 Nm",
		description: "Support d'étrier",
	},
	{
		categorie: "Freinage",
		type: "M12",
		pas: "1.75",
		matiere: "Acier",
		couple: "85 Nm",
		description: "Disque de frein",
	},

	{
		categorie: "Échappement",
		type: "M8",
		pas: "1.25",
		matiere: "Inox",
		couple: "20 Nm",
		description: "Collecteur",
	},
	{
		categorie: "Échappement",
		type: "M10",
		pas: "1.5",
		matiere: "Inox",
		couple: "40 Nm",
		description: "Bride d'échappement",
	},
];

export function TorqueDialog() {
	// Stock des états pour la recherche et le filtrage
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	// Récupérer les catégories uniques
	const categories = Array.from(new Set(torqueData.map((item) => item.categorie)));

	// Filtrer les données
	const filteredData = torqueData.filter((item) => {
		// Vérifier si le terme de recherche correspond au type, à la description ou à la catégorie
		const matchesSearch =
			item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.categorie.toLowerCase().includes(searchTerm.toLowerCase());
		// Vérifier si la catégorie correspond à celle sélectionnée (ou si "all" est sélectionné)
		const matchesCategory = selectedCategory === "all" || item.categorie === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full">Ouvrir</Button>
			</DialogTrigger>
			<DialogContent className="flex max-h-[80vh] max-w-xl flex-col overflow-hidden p-4 md:max-h-[95vh] md:max-w-7xl md:p-8">
				<DialogHeader>
					<DialogTitle>Couples de serrage recommandés</DialogTitle>
					<DialogDescription>
						Valeurs indicatives selon la pièce, le type de vis et la matière
					</DialogDescription>
				</DialogHeader>

				{/* Filtres */}
				<div className="flex flex-col gap-3 py-3 sm:flex-row">
					<Input
						placeholder="Rechercher par type, catégorie ou description..."
						value={searchTerm}
						// Met à jour le terme de recherche à chaque changement de l'input
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-1"
					/>
					{/* Menu déroulant pour filtrer la catégorie */}
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="w-full sm:w-50">
							<SelectValue placeholder="Catégorie" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Toutes les catégories</SelectItem>
							{/* Affiche toutes les catégories uniques */}
							{categories.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Compteur de résultats */}
				<div className="text-muted-foreground text-sm">
					{filteredData.length} résultat{filteredData.length > 1 ? "s" : ""}
				</div>

				{/* Tableau avec scroll */}
				<div className="flex-1 overflow-y-auto rounded-md border">
					<Table>
						<TableHeader className="bg-background sticky top-0">
							<TableRow>
								<TableHead>Catégorie</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Pas (mm)</TableHead>
								<TableHead>Matière</TableHead>
								<TableHead className="font-semibold">Couple</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{/* Affiche les résultats si on en a */}
							{filteredData.length > 0 ? (
								filteredData.map((row, index) => (
									<TableRow key={index}>
										<TableCell>
											<Badge variant="outline">{row.categorie}</Badge>
										</TableCell>
										<TableCell>{row.description}</TableCell>
										<TableCell className="font-medium">{row.type}</TableCell>
										<TableCell>{row.pas}</TableCell>
										<TableCell>{row.matiere}</TableCell>
										<TableCell className="text-primary font-bold">
											{row.couple}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-muted-foreground text-center"
									>
										Aucun résultat trouvé
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	);
}
