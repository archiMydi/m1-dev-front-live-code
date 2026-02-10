"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AccountUser = {
	name: string;
	email: string;
};

type LogoutStatus = { type: "loading" } | { type: "error"; message: string };

export function AccountCard({ user }: { user: AccountUser }) {
	const router = useRouter();
	const [logoutStatus, setLogoutStatus] = useState<LogoutStatus | null>(null);

	async function handleLogout() {
		setLogoutStatus({ type: "loading" });

		try {
			await authClient.signOut();
			router.push("/auth/login");
			router.refresh();
		} catch {
			setLogoutStatus({
				type: "error",
				message: "Impossible de se déconnecter, réessayez",
			});
		}
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Informations personnelles</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<p className="text-muted-foreground text-sm">Nom</p>
						<p className="font-medium">{user.name}</p>
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Email</p>
						<p className="font-medium">{user.email}</p>
					</div>
				</CardContent>
			</Card>

			{logoutStatus?.type === "error" && (
				<p className="text-destructive text-sm">{logoutStatus.message}</p>
			)}

			<Button
				variant="destructive"
				className="w-full sm:w-auto"
				disabled={logoutStatus?.type === "loading"}
				onClick={handleLogout}
			>
				{logoutStatus?.type === "loading" ? "Déconnexion..." : "Se déconnecter"}
			</Button>
		</div>
	);
}
