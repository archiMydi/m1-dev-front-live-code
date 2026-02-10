"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { customers } from "../customers/data";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconExternalLink, IconPlus } from "@tabler/icons-react";
import { CreateVehicleDialog } from "@/components/create-vehicle-dialog";
import { useState } from "react";

// 1. Derive flat vehicle list from customers
type VehicleWithOwner = {
	id: string; // Artificial ID using index or combination
	brand: string;
	model: string;
	plate: string;
	vin: string;
	ownerId: string;
	ownerName: string;
};

const allVehicles: VehicleWithOwner[] = customers.flatMap((c) =>
	c.vehicles.map((v, i) => ({
		id: `${c.id}-${i}`,
		brand: v.brand,
		model: v.model,
		plate: v.plate,
		vin: v.vin,
		ownerId: c.id,
		ownerName: `${c.firstName} ${c.name}`,
	})),
);

// 2. Define Columns
const columns: ColumnDef<VehicleWithOwner>[] = [
	{
		accessorKey: "plate",
		header: "Immatriculation",
		cell: ({ row }) => <span className="font-medium">{row.getValue("plate")}</span>,
	},
	{
		accessorKey: "brand",
		header: "Marque",
	},
	{
		accessorKey: "model",
		header: "Modèle",
	},
	{
		accessorKey: "ownerName",
		header: "Propriétaire",
		cell: ({ row }) => (
			<Link
				href={`/customers/${row.original.ownerId}`}
				className="flex items-center gap-1 hover:underline"
			>
				{row.getValue("ownerName")}
				<IconExternalLink className="text-muted-foreground size-3" />
			</Link>
		),
	},
	{
		accessorKey: "vin",
		header: "VIN",
		cell: ({ row }) => (
			<span className="text-muted-foreground font-mono text-xs">{row.getValue("vin")}</span>
		),
	},
];

// 3. Client Side Data Table Component
function DataTable<TData, TValue>({
	columns,
	data,
}: {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Aucun résultat.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default function Page() {
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold tracking-tight">Liste Véhicules</h1>
						<Button
							size="sm"
							className="gap-2"
							onClick={() => setShowCreateDialog(true)}
						>
							<IconPlus className="size-4" />
							<span className="hidden sm:inline">Nouveau véhicule</span>
						</Button>
					</div>

					<CreateVehicleDialog
						open={showCreateDialog}
						onOpenChange={setShowCreateDialog}
					/>

					<div className="rounded-xl border bg-white p-1 shadow-sm dark:bg-zinc-950">
						<DataTable columns={columns} data={allVehicles} />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
