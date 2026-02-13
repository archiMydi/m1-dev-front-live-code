"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { customers } from "../customers/data";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	ColumnFiltersState,
} from "@tanstack/react-table";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconExternalLink, IconPlus, IconArrowsSort, IconCar, IconUser } from "@tabler/icons-react";
import { CreateVehicleDialog } from "@/components/create-vehicle-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Immatriculation
					<IconArrowsSort className="ml-2 size-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<Link
				href={`/documents?plate=${row.getValue("plate")}`}
				className="flex items-center gap-1 font-medium hover:underline"
			>
				{row.getValue("plate")}
				<IconExternalLink className="text-muted-foreground size-3" />
			</Link>
		),
	},
	{
		accessorKey: "ownerName",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Propriétaire
					<IconArrowsSort className="ml-2 size-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const ownerName = row.getValue("ownerName") as string;
			const initial = ownerName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
			return (
				<Link
					href={`/customers/${row.original.ownerId}`}
					className="flex items-center gap-2 hover:underline"
				>
					<Avatar className="h-6 w-6 border border-zinc-200 dark:border-zinc-800">
						<AvatarImage
							src={`https://api.dicebear.com/9.x/initials/svg?seed=${ownerName}`}
							alt={ownerName}
						/>
						<AvatarFallback className="text-[10px]">{initial}</AvatarFallback>
					</Avatar>
					<div className="flex items-center gap-1">
						{ownerName}
						<IconExternalLink className="text-muted-foreground size-3" />
					</div>
				</Link>
			);
		},
	},
	{
		accessorKey: "brand",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Marque
					<IconArrowsSort className="ml-2 size-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "model",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Modèle
					<IconArrowsSort className="ml-2 size-4" />
				</Button>
			);
		},
	},
	// {
	// 	accessorKey: "vin",
	// 	header: "VIN",
	// 	cell: ({ row }) => (
	// 		<span className="text-muted-foreground font-mono text-xs">{row.getValue("vin")}</span>
	// 	),
	// },
];

// 3. Client Side Data Table Component
function DataTable<TData, TValue>({
	columns,
	data,
	onAddClick,
}: {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onAddClick: () => void;
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div className="flex flex-col gap-4">
			{/* Table Header with Title & Filters */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold tracking-tight">Liste Véhicules</h2>
				<Button variant="outline" size="sm" className="gap-2" onClick={onAddClick}>
					<IconPlus className="size-4" />
					<span className="hidden sm:inline">Nouveau véhicule</span>
				</Button>
			</div>

			<div className="flex flex-col gap-4 sm:flex-row">
				<Input
					placeholder="Filtrer par immatriculation"
					value={(table.getColumn("plate")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("plate")?.setFilterValue(event.target.value)
					}
					className="max-w-52.5"
				/>
				<Input
					placeholder="Filtrer par propriétaire"
					value={(table.getColumn("ownerName")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("ownerName")?.setFilterValue(event.target.value)
					}
					className="max-w-52.5"
				/>
			</div>

			{/* Desktop View */}
			<div className="hidden rounded-md border md:block">
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
									Aucun résultat.
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
						defaultValue="plate-asc"
					>
						<SelectTrigger className="w-45">
							<SelectValue placeholder="Trier par..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="plate-asc">Immat (A-Z)</SelectItem>
							<SelectItem value="plate-desc">Immat (Z-A)</SelectItem>
							<SelectItem value="ownerName-asc">Propriétaire (A-Z)</SelectItem>
							<SelectItem value="brand-asc">Marque (A-Z)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{table.getRowModel().rows.length > 0 ? (
					table.getRowModel().rows.map((row) => {
						const original = row.original as VehicleWithOwner;
						const ownerName = original.ownerName;
						const initial = ownerName
							.split(" ")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 2);

						return (
							<Card key={row.id}>
								<CardContent className="p-0">
									<div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
										<div className="flex items-center gap-2 font-medium">
											<IconCar className="text-muted-foreground size-4" />
											<span>
												{original.brand} {original.model}
											</span>
										</div>
										<Badge
											variant="outline"
											className="bg-background text-muted-foreground font-mono font-normal"
										>
											{original.plate}
										</Badge>
									</div>
									<div className="flex items-center justify-between p-4">
										<Link
											href={`/customers/${original.ownerId}`}
											className="group flex items-center gap-3"
										>
											<Avatar className="size-9 border border-zinc-200 dark:border-zinc-800">
												<AvatarImage
													src={`https://api.dicebear.com/9.x/initials/svg?seed=${ownerName}`}
													alt={ownerName}
												/>
												<AvatarFallback className="text-xs">
													{initial}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="text-sm font-medium group-hover:underline">
													{ownerName}
												</span>
												<span className="text-muted-foreground text-xs">
													Propriétaire
												</span>
											</div>
										</Link>

										<Button
											variant="outline"
											size="sm"
											asChild
											className="h-8 text-xs"
										>
											<Link href={`/documents?plate=${original.plate}`}>
												Dossier <IconExternalLink className="ml-1 size-3" />
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})
				) : (
					<div className="rounded-lg border border-dashed p-8 text-center text-zinc-500">
						Aucun véhicule trouvé.
					</div>
				)}
			</div>
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
				<div className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:p-6 lg:pb-6">
					<CreateVehicleDialog
						open={showCreateDialog}
						onOpenChange={setShowCreateDialog}
					/>

					<div className="rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-950">
						<DataTable
							columns={columns}
							data={allVehicles}
							onAddClick={() => setShowCreateDialog(true)}
						/>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
