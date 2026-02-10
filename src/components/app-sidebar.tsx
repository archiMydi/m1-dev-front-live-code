"use client";

import * as React from "react";
import Link from "next/link";
import {
	IconCar,
	IconDashboard,
	IconFileDescription,
	IconInnerShadowTop,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { title } from "process";

const navMainData = {
	navMain: [
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
			title: "Documents",
			url: "/documents",
			icon: IconFileDescription,
		},
		{
			title: "Mini apps",
			url: "/mini-apps",
			icon: IconSettings,
		},
		{
			title: "Planning",
			url: "/appointments",
			icon: IconSettings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session, isPending } = authClient.useSession();

	const user = session?.user
		? {
				name: session.user.name || "User",
				email: session.user.email || "",
				avatar: session.user.image || "/avatars/default.jpg",
			}
		: null;

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="/">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">TyMécano.</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMainData.navMain} />
			</SidebarContent>
			<SidebarFooter>
				{isPending ? (
					<div className="flex items-center gap-3 px-2">
						<Skeleton className="h-8 w-8 rounded-lg" />
						<div className="flex-1 space-y-1.5">
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-2 w-32" />
						</div>
					</div>
				) : user ? (
					<NavUser user={user} />
				) : null}
			</SidebarFooter>
		</Sidebar>
	);
}
