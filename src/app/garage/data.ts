// Type pour les données d'un garage avec infos de membre
export type UserGarage = {
	id: number;
	name: string;
	address: string;
	phone: string;
	email: string;
	siret: string;
	logoUrl?: string;
	codeComptable: string;
	formeJuridique?: string;
	ape?: string;
	isOwner: boolean; // Si l'utilisateur est le propriétaire (ownerId)
	memberCount: number; // Nombre de membres dans garageMember
};

// Données fictives pour tester l'interface
export const mockUserGarages: UserGarage[] = [
	{
		id: 1,
		name: "Garage Central Paris",
		address: "12 rue de la Paix, 75002 Paris",
		phone: "01 23 45 67 89",
		email: "contact@garagecentral.fr",
		siret: "123 456 789 00012",
		codeComptable: "411001",
		formeJuridique: "SARL",
		ape: "4520A",
		logoUrl: "https://placehold.co/100x100/blue/white?text=GCP",
		isOwner: true, // L'utilisateur est le propriétaire
		memberCount: 5,
	},
	{
		id: 2,
		name: "Méca Auto Services",
		address: "45 avenue des Champs, 75008 Paris",
		phone: "01 98 76 54 32",
		email: "contact@mecaauto.fr",
		siret: "987 654 321 00012",
		codeComptable: "411002",
		formeJuridique: "SAS",
		ape: "4520B",
		isOwner: false, // L'utilisateur est juste membre
		memberCount: 3,
	},
	{
		id: 3,
		name: "Auto Réparation Express",
		address: "78 boulevard Saint-Michel, 75005 Paris",
		phone: "01 45 67 89 12",
		email: "contact@autorep.fr",
		siret: "456 789 123 00012",
		codeComptable: "411003",
		formeJuridique: "EURL",
		ape: "4520A",
		isOwner: true,
		memberCount: 2,
	},
];

// Type pour les données de formulaire de création de garage
export type CreateGarageFormData = {
	name: string;
	address: string;
	phone: string;
	email: string;
	siret: string;
	codeComptable: string;
	formeJuridique: string;
	ape: string;
	logoUrl: string;
};

// Valeurs initiales pour le formulaire de création de garage
export const initialCreateGarageFormData: CreateGarageFormData = {
	name: "",
	address: "",
	phone: "",
	email: "",
	siret: "",
	codeComptable: "",
	formeJuridique: "",
	ape: "",
	logoUrl: "",
};
