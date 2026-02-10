"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormStatus = { type: "loading" } | { type: "error"; message: string };

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const router = useRouter();
	const [formStatus, setFormStatus] = useState<FormStatus | null>(null);

	function onSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		handleSignup(new FormData(e.currentTarget));
	}

	async function handleSignup(data: FormData) {
		const password = data.get("password") as string;
		const confirmPassword = data.get("confirm-password") as string;

		// Check if passwords match
		if (password !== confirmPassword) {
			setFormStatus({
				type: "error",
				message: "Passwords do not match",
			});
			return;
		}

		setFormStatus({ type: "loading" });
		try {
			const res = await authClient.signUp.email({
				email: data.get("email") as string,
				password,
				name: data.get("name") as string,
			});

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
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
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
							<FieldLabel htmlFor="name">Full Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="John Doe"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
							<FieldDescription>
								We&apos;ll use this to contact you. We will not share your email
								with anyone else.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input id="password" name="password" type="password" required />
							<FieldDescription>Must be at least 8 characters long.</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
							<Input
								id="confirm-password"
								name="confirm-password"
								type="password"
								required
							/>
							<FieldDescription>Please confirm your password.</FieldDescription>
						</Field>
						<FieldGroup>
							<Field>
								<Button type="submit" disabled={formStatus?.type === "loading"}>
									{formStatus?.type === "loading"
										? "Creating account..."
										: "Sign Up"}
								</Button>
								<FieldDescription className="px-6 text-center">
									Already have an account? <a href="/auth/login">Sign in</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
