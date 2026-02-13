"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CreateGarageDialog } from "@/components/create-garage-dialog";
import { JoinGarageDialog } from "@/components/join-garage-dialog";
import { trpc } from "@/trpc/client";

export default function GaragePage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

	const userGarages = trpc.garages.listMine.useQuery();

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

				{/* Contenu principal */}
				<div className="space-y-6 p-6 pb-20 md:pb-6">
					{/* En-tête avec titre */}
					<div>
						<h1 className="text-3xl font-bold">Mes Garages</h1>
					</div>

					{/* Boutons d'action */}
					<div className="flex flex-col gap-3 sm:flex-row">
						<Button onClick={() => setIsCreateDialogOpen(true)}>Créer un garage</Button>
						<Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
							Rejoindre un garage
						</Button>
					</div>

					{/* Liste des garages */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{userGarages.data != null && userGarages.data.length > 0 ? (
							userGarages.data.map((garage) => (
								<Card
									key={garage.id}
									className="cursor-pointer transition-shadow hover:shadow-lg"
								>
									<CardHeader>
										<div className="mb-2 flex items-start justify-between">
											<Badge
												variant={garage.isOwner ? "default" : "secondary"}
											>
												{garage.isOwner ? "Propriétaire" : "Membre"}
											</Badge>
										</div>
										<CardTitle className="text-lg">{garage.name}</CardTitle>
										<CardDescription className="space-y-1">
											<div className="text-sm">{garage.address}</div>
											<div className="text-xs">
												Membres : {garage.memberCount}
											</div>
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Button className="w-full" variant="outline" asChild>
											<Link href={`/garage/${garage.id}`}>
												Gérer le garage
											</Link>
										</Button>
									</CardContent>
								</Card>
							))
						) : (
							// Message si aucun garage
							<div className="col-span-full py-12 text-center">
								<p className="text-muted-foreground mb-4">
									Vous n'appartenez à aucun garage pour le moment
								</p>
								<Button onClick={() => setIsCreateDialogOpen(true)}>
									Créer votre premier garage
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Modales */}
				<CreateGarageDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
				/>
				<JoinGarageDialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen} />
			</SidebarInset>
		</SidebarProvider>
	);
}
