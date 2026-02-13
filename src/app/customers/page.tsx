"use client";

import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	IconPlus,
	IconChevronRight,
	IconSearch,
	IconCar,
	IconMapPin,
	IconMail,
} from "@tabler/icons-react";
import { trpc } from "@/trpc/client";
import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CreateCustomerDialog } from "@/components/create-customer-dialog";

const SEARCH_DEBOUNCE_MS = 300;

export default function Page() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const query = searchParams.get("q") ?? "";

	const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(
		null,
	);

	function setQuery(term: string) {
		// Clear any existing debounce timeout
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		// Set a new debounce timeout
		const timeout = setTimeout(() => {
			setDebounceTimeout(null);
			handleSearch(term);
		}, SEARCH_DEBOUNCE_MS);

		setDebounceTimeout(timeout);
	}

	const { data: results, isLoading } = trpc.customers.search.useQuery({
		q: query,
	});

	function handleSearch(term: string | undefined | null) {
		const params = new URLSearchParams(searchParams);

		if (term && term !== "") {
			params.set("q", term);
		} else {
			params.delete("q");
		}

		startTransition(() => {
			router.replace(`${pathname}?${params.toString()}`, {
				scroll: false,
			});
		});
	}

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
						<h1 className="text-2xl font-bold tracking-tight">Liste Clients</h1>
						<Button
							variant="outline"
							size="sm"
							className="gap-2"
							onClick={() => setShowCreateDialog(true)}
						>
							<IconPlus className="size-4" />
							<span className="hidden sm:inline">Nouveau client</span>
						</Button>
					</div>

					<CreateCustomerDialog
						open={showCreateDialog}
						onOpenChange={setShowCreateDialog}
					/>

					<div className="relative">
						<IconSearch className="text-muted-foreground absolute top-2.5 left-2 size-4" />
						<Input
							placeholder="Rechercher un client..."
							className="pl-8"
							defaultValue={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						{isPending && (
							<div className="absolute top-2.5 right-2">
								<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-zinc-500"></div>
							</div>
						)}
					</div>

					<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
						{/* Desktop Table Query Wrapper */}
						<div className="hidden md:block">
							<Table>
								<TableHeader>
									<TableRow className="bg-zinc-50 hover:bg-zinc-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/50">
										<TableHead className="w-75">Client</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Véhicules</TableHead>
										<TableHead className="text-right"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{results != null ? (
										results.length > 0 ? (
											results.map((customer) => (
												<TableRow
													key={customer.id}
													className="group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
													onClick={() =>
														router.push(`/customers/${customer.id}`)
													}
												>
													<TableCell>
														<div className="flex items-center gap-3">
															<Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
																<AvatarImage
																	src={`https://api.dicebear.com/9.x/initials/svg?seed=${customer.firstName} ${customer.name}`}
																	alt={`${customer.firstName} ${customer.name}`}
																/>
																<AvatarFallback>
																	{customer.firstName[0]}
																	{customer.name[0]}
																</AvatarFallback>
															</Avatar>
															<div className="flex flex-col">
																<span className="group-hover:text-primary text-base font-semibold text-zinc-900 transition-colors dark:text-zinc-100">
																	{customer.name}{" "}
																	{customer.firstName}
																</span>
																<span className="text-sm text-zinc-500 dark:text-zinc-400">
																	ID: {customer.id} |{" "}
																	<span className="inline-flex items-center gap-1">
																		<IconMapPin className="size-3" />{" "}
																		{customer.city}
																	</span>
																</span>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
															<span className="flex items-center gap-2">
																<IconMail className="size-4 opacity-70" />
																{customer.email}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex flex-wrap gap-2">
															{customer.vehicles.length > 0 ? (
																customer.vehicles.map((v, i) => (
																	<Badge
																		key={i}
																		variant="secondary"
																		className="border-zinc-200 font-normal dark:border-zinc-800"
																	>
																		<IconCar className="mr-1 size-3 opacity-70" />
																		{v.plate}
																	</Badge>
																))
															) : (
																<span className="text-sm text-zinc-400 italic">
																	Aucun véhicule
																</span>
															)}
														</div>
													</TableCell>
													<TableCell className="text-right">
														<Button
															variant="ghost"
															size="icon"
															className="text-muted-foreground group-hover:text-primary"
														>
															<IconChevronRight className="size-5" />
														</Button>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={4}
													className="text-muted-foreground h-24 text-center"
												>
													Aucun résultat trouvé pour "{query}"
												</TableCell>
											</TableRow>
										)
									) : (
										<TableRow>
											<TableCell
												colSpan={4}
												className="text-muted-foreground h-24 text-center"
											>
												{isLoading
													? "Chargement des clients..."
													: "Recherchez un client"}
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>

						{/* Mobile List View */}
						<ul className="divide-y divide-zinc-200 md:hidden dark:divide-zinc-800">
							{results != null ? (
								results.map((customer) => (
									<li key={customer.id}>
										<Link
											href={`/customers/${customer.id}`}
											className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
										>
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-3">
													<Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
														<AvatarImage
															src={`https://api.dicebear.com/9.x/initials/svg?seed=${customer.firstName} ${customer.name}`}
															alt={`${customer.firstName} ${customer.name}`}
														/>
														<AvatarFallback>
															{customer.firstName[0]}
															{customer.name[0]}
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-col">
														<span className="text-base font-semibold">
															{customer.name} {customer.firstName}
														</span>
														<span className="text-muted-foreground flex items-center gap-1 text-xs">
															<IconMapPin className="size-3" />
															{customer.city}
														</span>
														<span className="text-muted-foreground flex items-center gap-1 text-xs">
															<IconMail className="size-3" />
															{customer.email}
														</span>
													</div>
												</div>
												<div className="mt-2 flex flex-wrap gap-2 pl-13 text-sm">
													{customer.vehicles.length > 0 ? (
														<>
															{customer.vehicles
																.slice(0, 3)
																.map((v, i) => (
																	<Badge
																		key={i}
																		variant="secondary"
																		className="border-zinc-200 font-normal dark:border-zinc-800"
																	>
																		<IconCar className="mr-1 size-3 opacity-70" />
																		{v.plate}
																	</Badge>
																))}
															{customer.vehicles.length > 3 && (
																<span className="text-muted-foreground self-center text-xs">
																	+{customer.vehicles.length - 3}
																</span>
															)}
														</>
													) : (
														<span className="text-sm text-zinc-400 italic">
															Aucun véhicule
														</span>
													)}
												</div>
											</div>
											<IconChevronRight className="text-muted-foreground ml-2 size-5" />
										</Link>
									</li>
								))
							) : (
								<li className="p-8 text-center text-zinc-500">
									{isLoading ? "Chargement..." : "Aucun résultat trouvé."}
								</li>
							)}
						</ul>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
