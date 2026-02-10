import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CTAButton } from "./client";

interface Hero7Props {
	heading?: string;
	description?: string;
	reviews?: {
		count: number;
		rating?: number;
		avatars: {
			src: string;
			alt: string;
		}[];
	};
	className?: string;
}

const Hero7 = ({
	heading = "TyMécano",
	description = "Découvrez les secrets des mécanismes complexes et perfectionnez vos compétences en mécanique.",
	reviews = {
		count: 267,
		rating: 5.0,
		avatars: [
			{
				src: "/assets/avatars/avatar-1.webp",
				alt: "Avatar 1",
			},
			{
				src: "/assets/avatars/avatar-2.webp",
				alt: "Avatar 2",
			},
			{
				src: "/assets/avatars/avatar-3.webp",
				alt: "Avatar 3",
			},
			{
				src: "/assets/avatars/avatar-4.webp",
				alt: "Avatar 4",
			},
			{
				src: "/assets/avatars/avatar-5.webp",
				alt: "Avatar 5",
			},
		],
	},
	className,
}: Hero7Props) => {
	return (
		<section className={cn("flex h-screen items-center py-32", className)}>
			<div className="w-full text-center">
				<div className="mx-auto flex max-w-5xl flex-col gap-6">
					<h1 className="text-3xl font-semibold lg:text-6xl">{heading}</h1>
					<p className="text-muted-foreground text-balance lg:text-lg">{description}</p>
				</div>
				<CTAButton />
				<div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
					<span className="mx-4 inline-flex items-center -space-x-4">
						{reviews.avatars.map((avatar, index) => (
							<Avatar key={index} className="size-14 border">
								<AvatarImage src={avatar.src} alt={avatar.alt} />
							</Avatar>
						))}
					</span>
					<div>
						<div className="flex items-center gap-1">
							{[...Array(5)].map((_, index) => (
								<Star
									key={index}
									className="size-5 fill-yellow-400 text-yellow-400"
								/>
							))}
							<span className="mr-1 font-semibold">{reviews.rating?.toFixed(1)}</span>
						</div>
						<p className="text-muted-foreground text-left font-medium">
							sur plus de {reviews.count} avis
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero7;
