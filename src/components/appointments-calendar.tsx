"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DayPilot, DayPilotCalendar } from "daypilot-pro-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentsModal from "@/components/appointments-modal";
import { trpc } from "@/trpc/client";
import type { Customer, InitialDateTime, Mission, Part, User, Vehicle } from "@/lib/types";

export default function AppointmentsCalendar() {
	const router = useRouter();
	const calendarRef = useRef<DayPilotCalendar>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [initialDateTime, setInitialDateTime] = useState<InitialDateTime>(null);

	// Récupérer les données depuis tRPC
	const { data: missions = [] } = trpc.missions.list.useQuery();
	const { data: vehicles = [] } = trpc.vehicles.list.useQuery();
	const { data: parts = [] } = trpc.parts.list.useQuery();
	const { data: usersData = [] } = trpc.users.list.useQuery();
	const { data: customersData = [] } = trpc.customers.list.useQuery();

	// Convertir les utilizzatori et clients en format compatible
	const users: User[] = usersData.map((u) => ({
		id: parseInt(u.id),
		name: u.name,
	}));

	const customers: Customer[] = customersData.map((c) => ({
		id: parseInt(c.id),
		name: c.name,
	}));

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
