"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconArrowsSort } from "@tabler/icons-react";
import { useState } from "react";
import { Intervention } from "../data";

const columns: ColumnDef<Intervention>[] = [
	{
		accessorKey: "startDate",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 hover:bg-transparent"
			>
				Début
				<IconArrowsSort className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium">{row.getValue("startDate")}</span>
				<span className="text-muted-foreground text-xs">{row.original.startTime}</span>
			</div>
		),
	},
	{
		accessorKey: "endDate",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 hover:bg-transparent"
			>
				Fin
				<IconArrowsSort className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => (
			<div className="flex flex-col">
				<span className="font-medium">{row.getValue("endDate")}</span>
				<span className="text-muted-foreground text-xs">{row.original.endTime}</span>
			</div>
		),
	},
	{
		accessorKey: "type",
		header: "Mission",
		cell: ({ row }) => <span className="font-medium">{row.getValue("type")}</span>,
	},
	{
		accessorKey: "vehiclePlate",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0 hover:bg-transparent"
			>
				Véhicule
				<IconArrowsSort className="ml-2 size-4" />
			</Button>
		),
		cell: ({ row }) => (
			<span className="text-muted-foreground font-mono text-xs">
				{row.getValue("vehiclePlate")}
			</span>
		),
	},
	{
		accessorKey: "parts",
		header: "Pièces",
		cell: ({ row }) => {
			const parts = row.original.parts;
			if (!parts || parts.length === 0)
				return <span className="text-muted-foreground text-xs italic">Aucune pièce</span>;
			return (
				<div className="flex flex-col gap-1 text-sm">
					{parts.map((part, index) => (
						<div key={index} className="flex justify-between gap-2">
							<span>{part.name}</span>
							<span className="text-muted-foreground min-w-15 text-right text-xs">
								{new Intl.NumberFormat("fr-FR", {
									style: "currency",
									currency: "EUR",
								}).format(part.price)}
							</span>
						</div>
					))}
				</div>
			);
		},
	},
	{
		accessorKey: "totalPrice",
		header: ({ column }) => (
			<div className="text-right">
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="px-0 hover:bg-transparent"
				>
					Total
					<IconArrowsSort className="ml-2 size-4" />
				</Button>
			</div>
		),
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("totalPrice"));
			const formatted = new Intl.NumberFormat("fr-FR", {
				style: "currency",
				currency: "EUR",
			}).format(price);
			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
];

export function HistoryDataTable({ data }: { data: Intervention[] }) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "startDate", desc: true }, // Default recent first
	]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
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
								Aucune intervention trouvée.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
