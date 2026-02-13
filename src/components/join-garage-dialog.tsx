"user client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";

interface JoinGarageDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function JoinGarageDialog({ open, onOpenChange }: JoinGarageDialogProps) {
	const [inviteCode, setInviteCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(false);
		setIsLoading(true);

		if (inviteCode.length < 6) {
			setError("Le code d'invitation doit contenir au moins 6 caractères");
			setIsLoading(false);
			return;
		}

		// TODO: Appel API tRPC
		console.log("Tentative de rejoindre avec le code:", inviteCode);

		setTimeout(() => {
			const isValid = inviteCode !== "INVALID";

			if (isValid) {
				setSuccess(true);
				setTimeout(() => {
					setIsLoading(false);
					onOpenChange(false);
					setInviteCode("");
					setSuccess(false);
				}, 1500);
			} else {
				setError("Code d'invitation invalide ou expiré");
				setIsLoading(false);
			}
		}, 1000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Rejoindre un garage</DialogTitle>
					<DialogDescription>
						Entrez le code d'invitation fourni par l'administrateur du garage
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="inviteCode">Code d'invitation *</Label>
						<Input
							id="inviteCode"
							placeholder="Ex: ABC123XYZ"
							value={inviteCode}
							onChange={(e) => {
								setInviteCode(e.target.value.toUpperCase());
								setError("");
							}}
							required
							className="text-center font-mono text-lg tracking-wider"
							maxLength={20}
						/>
					</div>

					{/* Message d'erreur */}
					{error && (
						<Alert variant="destructive">
							<AlertDescription>Erreur : {error}</AlertDescription>
						</Alert>
					)}

					{/* Message de succès */}
					{success && (
						<Alert className="border-green-500 text-green-700">
							<AlertDescription>
								Succès : Vous avez rejoint le garage avec succès !
							</AlertDescription>
						</Alert>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								onOpenChange(false);
								setInviteCode("");
								setError("");
								setSuccess(false);
							}}
						>
							Annuler
						</Button>
						<Button type="submit" disabled={isLoading || !inviteCode || success}>
							{isLoading ? "Vérification..." : "Rejoindre"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
