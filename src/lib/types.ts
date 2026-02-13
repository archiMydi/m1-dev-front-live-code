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
	status: "planned" | "in-progress" | "completed" | "cancelled";
}
