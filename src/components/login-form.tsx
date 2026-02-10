"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormStatus = { type: "loading" } | { type: "error"; message: string };

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const [formStatus, setFormStatus] = useState<FormStatus | null>(null);

	function onSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		handleSubmit(new FormData(e.currentTarget));
	}

	async function handleSubmit(data: FormData) {
		const email = data.get("email") as string;
		const password = data.get("password") as string;

		setFormStatus({ type: "loading" });
		try {
			const res = await authClient.signIn.email({ email, password });

			if (res.error) {
				throw new Error(res.error.message);
			}

			router.push("/dashboard");

			setFormStatus(null);
		} catch (err) {
			setFormStatus({
				type: "error",
				message: err instanceof Error ? err.message : "An unknown error occurred",
			});
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Connexion</CardTitle>
					<CardDescription>
						Entrez vos identifiants pour accéder à votre espace
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						{formStatus?.type === "error" && (
							<Alert variant="destructive" className="mb-4">
								<AlertDescription>{formStatus.message}</AlertDescription>
							</Alert>
						)}
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									name="email"
									placeholder="m@example.com"
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Mot de passe</FieldLabel>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										Mot de passe oublié ?
									</a>
								</div>
								<Input id="password" type="password" name="password" required />
							</Field>
							<Field>
								<Button type="submit" disabled={formStatus?.type === "loading"}>
									{formStatus?.type === "loading"
										? "Connexion..."
										: "Se connecter"}
								</Button>
								<FieldDescription className="text-center">
									Pas encore de compte ? <a href="/auth/register">Sign up</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
