// "use client";

// import { Input } from "@/components/ui/input";
// import { IconSearch } from "@tabler/icons-react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useTransition } from "react";

// export function Search() {
// 	const searchParams = useSearchParams();
// 	const pathname = usePathname();
// 	const router = useRouter();
// 	const [isPending, startTransition] = useTransition();

// 	function handleSearch(term: string | undefined | null) {
// 		const params = new URLSearchParams(searchParams);

// 		if (term && term !== "") {
// 			params.set("q", term);
// 		} else {
// 			params.delete("q");
// 		}

// 		startTransition(() => {
// 			router.replace(`${pathname}?${params.toString()}`, {
// 				scroll: false,
// 			});
// 		});
// 	}

// 	return (
// 		<div className="relative">
// 			<IconSearch className="text-muted-foreground absolute top-2.5 left-2 size-4" />
// 			<Input
// 				placeholder="Rechercher un client..."
// 				className="pl-8"
// 				defaultValue={searchParams.get("q")?.toString()}
// 				onChange={(e) => handleSearch(e.target.value)}
// 			/>
// 			{isPending && (
// 				<div className="absolute top-2.5 right-2">
// 					<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-zinc-500"></div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }
