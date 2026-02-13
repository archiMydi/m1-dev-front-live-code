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
import {
	IconArrowsSort,
	IconCalendar,
	IconCar,
	IconChevronDown,
	IconChevronUp,
	IconCurrencyEuro,
	IconTool,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Intervention } from "../data";

function HistoryMobileCard({ row }: { row: any }) {
	const [isOpen, setIsOpen] = useState(false);
	const parts = row.original.parts || [];
	const hasParts = parts.length > 0;

	return (
		<Card>
			<CardContent className="grid gap-3 p-4">
				{/* Header: Type + Date */}
				<div className="flex items-start justify-between">
					<div className="font-semibold">{row.original.type}</div>
					<Badge variant="outline" className="font-normal text-zinc-500">
						<IconCalendar className="mr-1 h-3 w-3" />
						{row.original.startDate}
					</Badge>
				</div>

				<div className="grid grid-cols-2 gap-2 text-sm text-zinc-500">
					<div className="flex items-center gap-2">
						<IconCar className="h-4 w-4 opacity-70" />
						{row.original.vehiclePlate}
					</div>
					<div className="flex items-center justify-end gap-2">
						<span className="text-foreground flex items-center font-medium">
							<IconCurrencyEuro className="text-muted-foreground mr-1 h-4 w-4" />
							{new Intl.NumberFormat("fr-FR", {
								style: "decimal",
								minimumFractionDigits: 2,
							}).format(row.original.totalPrice)}
						</span>
					</div>
				</div>

				{/* Parts Accordion */}
				{hasParts && (
					<div className="mt-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="flex w-full items-center justify-between text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
						>
							<div className="flex items-center gap-2">
								<IconTool className="h-3 w-3" />
								<span>Pièces utilisées ({parts.length})</span>
							</div>
							{isOpen ? (
								<IconChevronUp className="h-3 w-3" />
							) : (
								<IconChevronDown className="h-3 w-3" />
							)}
						</button>

						{isOpen && (
							<div className="mt-2 space-y-2">
								{parts.map((p: any, i: number) => (
									<div
										key={i}
										className="flex justify-between rounded bg-zinc-50 p-2 text-xs dark:bg-zinc-900"
									>
										<span className="font-medium">{p.name}</span>
										<span className="text-muted-foreground">
											{new Intl.NumberFormat("fr-FR", {
												style: "currency",
												currency: "EUR",
											}).format(p.price)}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

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
		<div className="space-y-4">
			{/* Desktop View */}
			<div className="hidden rounded-md border md:block">
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
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
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

			{/* Mobile View */}
			<div className="grid gap-4 md:hidden">
				<div className="flex items-center gap-3">
					<h3 className="text-sm font-medium text-zinc-500">Trier par</h3>
					<Select
						onValueChange={(value) => {
							const [id, desc] = value.split("-");
							setSorting([{ id, desc: desc === "desc" }]);
						}}
						defaultValue="startDate-desc"
					>
						<SelectTrigger className="w-45">
							<SelectValue placeholder="Trier par..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="startDate-desc">Date (Récents)</SelectItem>
							<SelectItem value="startDate-asc">Date (Anciens)</SelectItem>
							<SelectItem value="totalPrice-desc">Prix (Décroissant)</SelectItem>
							<SelectItem value="totalPrice-asc">Prix (Croissant)</SelectItem>
							<SelectItem value="vehiclePlate-asc">Véhicule (A-Z)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{table.getRowModel().rows.length > 0 ? (
					table
						.getRowModel()
						.rows.map((row) => <HistoryMobileCard key={row.id} row={row} />)
				) : (
					<div className="rounded-lg border border-dashed p-8 text-center text-zinc-500">
						Aucune intervention trouvée.
					</div>
				)}
			</div>
		</div>
	);
}
