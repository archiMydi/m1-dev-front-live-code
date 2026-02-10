export interface Vehicle {
	brand: string;
	model: string;
	plate: string;
	vin: string;
}

export interface Intervention {
	date: string;
	mileage: string;
	type: string;
}

export interface Customer {
	id: string;
	name: string;
	firstName: string;
	email: string;
	postalcode: string;
	city: string;
	vehicles: Vehicle[];
	lastIntervention: Intervention;
}

export const customers: Customer[] = [
	{
		id: "1",
		name: "Dupont",
		firstName: "Jean",
		email: "jean.dupont@email.com",
		postalcode: "56000",
		city: "Vannes",
		vehicles: [
			{
				brand: "Peugeot",
				model: "208",
				plate: "AA-123-BB",
				vin: "VF31234567890123",
			},
			{
				brand: "Renault",
				model: "Clio IV",
				plate: "CC-456-DD",
				vin: "VF14567890123456",
			},
		],
		lastIntervention: {
			date: "12/03/2024",
			mileage: "45 000 km",
			type: "Vidange + Filtres",
		},
	},
	{
		id: "2",
		name: "Martin",
		firstName: "Alice",
		email: "a.martin@email.com",
		postalcode: "44490",
		city: "Le Croisic",
		vehicles: [
			{
				brand: "Citroën",
				model: "C3",
				plate: "EE-789-FF",
				vin: "VF74567890123456",
			},
		],
		lastIntervention: {
			date: "05/01/2024",
			mileage: "12 500 km",
			type: "Révision annuelle",
		},
	},
];
