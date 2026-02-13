export type MissionStatus = "planned" | "in-progress" | "completed" | "cancelled";

export interface Mission {
	id: number;
	title: string;
	customerId: number;
	vehicleId: number;
	userId: number;
	start: string;
	end: string;
	parts: number[];
	totalPrice: number;
	status: MissionStatus;
}

export interface Vehicle {
	id: number;
	plate: string;
	model: string;
	vin?: string | null;
	marque?: string | null;
}

export interface Part {
	id: number;
	name: string;
	price: number;
}
