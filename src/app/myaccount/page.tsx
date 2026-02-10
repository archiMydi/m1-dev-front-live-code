import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AccountCard } from "@/components/account-card";

export default async function MyAccountPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/login");
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
				<div>
					<h1 className="p-5 text-left text-3xl font-bold">Mon compte</h1>
				</div>
				<div
					className="px-5"
					style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
				>
					<AccountCard user={session.user} />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
