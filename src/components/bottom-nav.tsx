"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { IconCar, IconDashboard, IconSettings, IconUsers } from "@tabler/icons-react";

const navItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: IconDashboard,
	},
	{
		title: "Clients",
		url: "/customers",
		icon: IconUsers,
	},
	{
		title: "Véhicules",
		url: "/vehicles",
		icon: IconCar,
	},
	{
		title: "Planning",
		url: "/appointments",
		icon: IconSettings,
	},
];

export default function BottomNav() {
	const pathname = usePathname();

	return (
		<nav
			className="bg-background fixed right-0 bottom-0 left-0 border-t md:hidden"
			style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
		>
			<div className="flex h-16 items-center justify-around">
				{navItems.map((item) => {
					const isActive = pathname === item.url;
					const Icon = item.icon;

					return (
						<Link
							key={item.url}
							href={item.url}
							className={cn(
								"flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<Icon className="h-5 w-5" />
							<span className="text-[10px] font-medium">{item.title}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
