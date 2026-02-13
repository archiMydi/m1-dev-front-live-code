"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentsModal from "@/components/appointments-modal";

// TODO: remplacer par un vrai fetch depuis la BDD
const users = [
	{ id: 1, name: "Alice Dupont" },
	{ id: 2, name: "Bob Martin" },
	{ id: 3, name: "Charlie Durand" },
];

// TODO: remplacer par un vrai fetch depuis la BDD
const customers = [
	{ id: 1, name: "Jean Lefèvre" },
	{ id: 2, name: "Marie Blanc" },
	{ id: 3, name: "Pierre Noir" },
];

// TODO: remplacer par un vrai fetch depuis la BDD
const missions = [
	{
		id: 1,
		title: "Vidange + Filtres",
		vehicleId: 1,
		userId: 1,
		customerId: 1,
		start: "2026-02-13T09:00:00",
		end: "2026-02-13T10:00:00",
	},
	{
		id: 2,
		title: "Changement plaquettes",
		vehicleId: 2,
		userId: 2,
		customerId: 2,
		start: "2026-02-13T13:00:00",
		end: "2026-02-13T13:30:00",
	},
];

// TODO: remplacer par un vrai fetch depuis la BDD
const vehicles = [
	{ id: 1, plate: "AB-123-CD", model: "Toyota Corolla" },
	{ id: 2, plate: "EF-456-GH", model: "Peugeot 308" },
];

// TODO: remplacer par un vrai fetch depuis la BDD
const parts = [
	{ id: 1, name: "Filtre à huile", price: 29.99 },
	{ id: 2, name: "Plaquettes de frein", price: 49.99 },
	{ id: 3, name: "Batterie", price: 89.99 },
];

export type InitialDateTime = {
	startDate: Date;
	endDate: Date;
} | null;

export default function AppointmentsCalendar() {
	const router = useRouter();
	const calendarRef = useRef<DayPilotCalendar>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [initialDateTime, setInitialDateTime] = useState<InitialDateTime>(null);

	// Transformer les missions pour le format DayPilot avec HTML personnalisé
	const calendarEvents = missions.map((mission) => {
		const vehicle = vehicles.find((v) => v.id === mission.vehicleId);
		const user = users.find((u) => u.id === mission.userId);
		const customer = customers.find((c) => c.id === mission.customerId);

		return {
			id: mission.id,
			start: mission.start,
			end: mission.end,
			text: mission.title,
			html: `
				<div class="px-2 py-1 text-sm text-white h-full">
					<div class="font-semibold text-lg mb-4">${mission.title}</div>
					<div><div class="text-sm leading-6 flex justify-between">🚗 <p class="text-center">${vehicle?.plate || "N/A"}</p></div></div>
					<div><div class="text-sm leading-6 flex justify-between">🚗 <p class="text-center">${vehicle?.model || "N/A"}</p></div></div>
					<div><div class="text-sm leading-6 flex justify-between">👤 <p class="text-center">${user?.name || "N/A"}</p></div></div>
					<div><div class="text-sm leading-6 flex justify-between">🧑‍💼 <p class="text-center">${customer?.name || "N/A"}</p></div></div>
				</div>
			`,
			backColor: "#3b82f6",
			borderColor: "#2563eb",
		};
	});

	const handleTimeRangeSelect = (args: any) => {
		const startDate = new Date(args.start.value);
		const endDate = new Date(args.end.value);

		setInitialDateTime({ startDate, endDate });
		setShowCreateDialog(true);
	};

	const handleEventClick = (args: DayPilot.CalendarEventClickArgs) => {
		const missionId = args.e.id();
		router.push(`/appointments/${missionId}`);
	};

	const handleClose = () => {
		setShowCreateDialog(false);
		setInitialDateTime(null);
	};

	return (
		<div className="w-full space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Planning des Missions</h1>
				<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
					<DialogTrigger asChild>
						<Button>Nouvelle Mission</Button>
					</DialogTrigger>
					<AppointmentsModal
						initialDateTime={initialDateTime}
						vehicles={vehicles}
						users={users}
						customers={customers}
						parts={parts}
						onClose={handleClose}
					/>
				</Dialog>
			</div>

			<DayPilotCalendar
				ref={calendarRef}
				viewType="Week"
				locale="fr-fr"
				events={calendarEvents}
				onTimeRangeSelect={handleTimeRangeSelect}
				onEventClick={handleEventClick}
				startDate={DayPilot.Date.today()}
				durationBarVisible={false}
				cellHeight={150}
				dayBeginsHour={9}
				dayEndsHour={18}
				eventMoveHandling="Disabled"
				eventResizeHandling="Disabled"
			/>
		</div>
	);
}
