"use client";

import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconChevronRight, IconSearch } from "@tabler/icons-react";
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

	const { data: results, isLoading } = trpc.searchCustomer.useQuery({
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

					<div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
						<ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
							{results != null ? (
								results.map((customer) => (
									<li key={customer.id}>
										<Link
											href={`/customers/${customer.id}`}
											className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
										>
											<div className="flex flex-col">
												<span className="font-medium">
													{customer.name} {customer.firstName}
												</span>
												<span className="text-muted-foreground text-xs italic">
													{customer.vehicles.length > 0 ? (
														<>
															{customer.vehicles
																.slice(0, 2)
																.map((v, i) => (
																	<span key={i}>
																		Véhicule {i + 1} : [
																		{v.plate}]
																		{i === 0 &&
																			customer.vehicles
																				.length > 1 &&
																			", "}
																	</span>
																))}
															{customer.vehicles.length > 2 && (
																<span>
																	{" "}
																	et{" "}
																	{customer.vehicles.length -
																		2}{" "}
																	autres véhicules...
																</span>
															)}
														</>
													) : (
														"Aucun véhicule"
													)}
												</span>
											</div>
											<IconChevronRight className="text-muted-foreground size-5" />
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
