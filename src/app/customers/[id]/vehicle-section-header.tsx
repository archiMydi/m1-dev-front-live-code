"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { CreateVehicleDialog } from "@/components/create-vehicle-dialog";

export function VehicleSectionHeader({ customerId }: { customerId: string }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOpen(true)}>
				<IconPlus className="h-4 w-4" />
				<span className="sr-only">Ajouter un véhicule</span>
			</Button>

			<CreateVehicleDialog open={open} onOpenChange={setOpen} defaultOwnerId={customerId} />
		</>
	);
}
