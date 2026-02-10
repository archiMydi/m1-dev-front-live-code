"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function CTAButton() {
	const { data: session } = authClient.useSession();

	return (
		<Button asChild size="lg" className="mt-10">
			{session != null ? (
				<a href="/dashboard">Accéder au tableau de bord</a>
			) : (
				<a href="/auth/login">Commencer maintenant</a>
			)}
		</Button>
	);
}
