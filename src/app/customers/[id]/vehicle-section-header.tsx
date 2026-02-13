"use client";

import { CreateVehicleDialog } from "@/components/create-vehicle-dialog";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export function VehicleSectionHeader({ customerId }: { customerId: string }) {
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	return (
		<>
			<div className="mb-2 flex items-center justify-between lg:mb-4">
				<h2 className="text-lg font-semibold tracking-tight lg:text-lg">Véhicules</h2>
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => setShowCreateDialog(true)}
				>
					<IconPlus className="size-4" />
				</Button>
			</div>
			<CreateVehicleDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				defaultOwnerId={customerId}
			/>
		</>
	);
}
