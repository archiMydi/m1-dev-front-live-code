import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TorqueDialog } from "@/components/torque-dialog";

const apps = [
	{
		id: 1,
		name: "Couple de serrage",
		description: "Voici la description pour chaque application.",
		icon: "🔧",
		category: "Mécanique",
		dialog: TorqueDialog,
	},
	{
		id: 2,
		name: "CodeSnippet",
		description: "Voici la description pour chaque application.",
		icon: "🔧",
		category: "Dev",
		dialog: null,
	},
	{
		id: 3,
		name: "FitTracker",
		description: "Voici la description pour chaque application.",
		icon: "🔧",
		category: "Sport",
		dialog: null,
	},
	{
		id: 4,
		name: "BudgetBuddy",
		description: "Voici la description pour chaque application.",
		icon: "🔧",
		category: "Finance",
		dialog: null,
	},
];

export default function Page() {
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
				<div>
					<h1 className="p-5 text-left text-3xl font-bold">Mes Applications</h1>
				</div>

				<div
					className="m-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
					style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
				>
					{apps.map((app) => {
						const DialogComponent = app.dialog;

						return (
							<Card key={app.id}>
								<CardHeader>
									<div className="flex items-center gap-3">
										<span className="text-3xl">{app.icon}</span>
										<div className="flex-1">
											<CardTitle>{app.name}</CardTitle>
										</div>
										<Badge variant="secondary">{app.category}</Badge>
									</div>
									<CardDescription className="mt-2">
										{app.description}
									</CardDescription>
								</CardHeader>

								<CardFooter>
									{DialogComponent ? (
										<DialogComponent />
									) : (
										<Button className="w-full" disabled>
											Bientôt disponible
										</Button>
									)}
								</CardFooter>
							</Card>
						);
					})}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
