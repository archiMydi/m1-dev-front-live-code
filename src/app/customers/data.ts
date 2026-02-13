export interface Vehicle {
	brand: string;
	model: string;
	plate: string;
	vin: string;
}

export interface Part {
	name: string;
	price: number;
}

export interface Intervention {
	id: string;
	type: string;
	startDate: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endDate: string; // YYYY-MM-DD
	endTime: string; // HH:mm
	vehiclePlate: string;
	parts: Part[];
	totalPrice: number;
}

export interface Customer {
	id: string;
	name: string;
	firstName: string;
	email: string;
	postalcode: string;
	city: string;
	vehicles: Vehicle[];
	interventions: Intervention[];
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
		interventions: [
			{
				id: "int-1",
				type: "Vidange + Filtres",
				startDate: "2024-03-12",
				startTime: "09:00",
				endDate: "2024-03-12",
				endTime: "10:30",
				vehiclePlate: "AA-123-BB",
				parts: [
					{ name: "Huile 5W30", price: 45.0 },
					{ name: "Filtre huile", price: 12.0 },
				],
				totalPrice: 107.0,
			},
			{
				id: "int-2",
				type: "Plaquettes de frein",
				startDate: "2023-11-15",
				startTime: "14:00",
				endDate: "2023-11-15",
				endTime: "15:30",
				vehiclePlate: "CC-456-DD",
				parts: [{ name: "Kit plaquettes AV", price: 89.0 }],
				totalPrice: 149.0,
			},
		],
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
		interventions: [
			{
				id: "int-3",
				type: "Révision annuelle",
				startDate: "2024-01-05",
				startTime: "08:30",
				endDate: "2024-01-05",
				endTime: "17:00",
				vehiclePlate: "EE-789-FF",
				parts: [
					{ name: "Filtre air", price: 15.0 },
					{ name: "Filtre habitacle", price: 20.0 },
					{ name: "Bougies", price: 40.0 },
				],
				totalPrice: 220.0,
			},
		],
	},
];
