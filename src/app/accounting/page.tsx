import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const chartData = [
	{ date: "2024-04-01", desktop: 222, mobile: 150, other: 50 },
	{ date: "2024-04-02", desktop: 97, mobile: 180, other: 30 },
	{ date: "2024-04-03", desktop: 167, mobile: 120, other: 20 },
	{ date: "2024-04-04", desktop: 242, mobile: 260, other: 40 },
	{ date: "2024-04-05", desktop: 373, mobile: 290, other: 60 },
	{ date: "2024-04-06", desktop: 301, mobile: 340, other: 80 },
	{ date: "2024-04-07", desktop: 245, mobile: 180, other: 25 },
	{ date: "2024-04-08", desktop: 409, mobile: 320, other: 70 },
	{ date: "2024-04-09", desktop: 59, mobile: 110, other: 15 },
	{ date: "2024-04-10", desktop: 261, mobile: 190, other: 35 },
	{ date: "2024-04-11", desktop: 327, mobile: 350, other: 90 },
	{ date: "2024-04-12", desktop: 292, mobile: 210, other: 45 },
	{ date: "2024-04-13", desktop: 342, mobile: 380, other: 100 },
	{ date: "2024-04-14", desktop: 137, mobile: 220, other: 30 },
	{ date: "2024-04-15", desktop: 120, mobile: 170, other: 20 },
	{ date: "2024-04-16", desktop: 138, mobile: 190, other: 25 },
	{ date: "2024-04-17", desktop: 446, mobile: 360, other: 80 },
	{ date: "2024-04-18", desktop: 364, mobile: 410, other: 90 },
	{ date: "2024-04-19", desktop: 243, mobile: 180, other: 40 },
	{ date: "2024-04-20", desktop: 89, mobile: 150, other: 25 },
	{ date: "2024-04-21", desktop: 137, mobile: 200, other: 30 },
	{ date: "2024-04-22", desktop: 224, mobile: 170, other: 35 },
	{ date: "2024-04-23", desktop: 138, mobile: 230, other: 30 },
	{ date: "2024-04-24", desktop: 387, mobile: 290, other: 70 },
	{ date: "2024-04-25", desktop: 215, mobile: 250, other: 50 },
	{ date: "2024-04-26", desktop: 75, mobile: 130, other: 20 },
	{ date: "2024-04-27", desktop: 383, mobile: 420, other: 90 },
	{ date: "2024-04-28", desktop: 122, mobile: 180, other: 30 },
	{ date: "2024-04-29", desktop: 315, mobile: 240, other: 50 },
	{ date: "2024-04-30", desktop: 454, mobile: 380, other: 100 },
	{ date: "2024-05-01", desktop: 165, mobile: 220, other: 40 },
	{ date: "2024-05-02", desktop: 293, mobile: 310, other: 60 },
	{ date: "2024-05-03", desktop: 247, mobile: 190, other: 40 },
	{ date: "2024-05-04", desktop: 385, mobile: 420, other: 80 },
	{ date: "2024-05-05", desktop: 481, mobile: 390, other: 100 },
	{ date: "2024-05-06", desktop: 498, mobile: 520, other: 120 },
	{ date: "2024-05-07", desktop: 388, mobile: 300, other: 80 },
	{ date: "2024-05-08", desktop: 149, mobile: 210, other: 40 },
	{ date: "2024-05-09", desktop: 227, mobile: 180, other: 30 },
	{ date: "2024-05-10", desktop: 293, mobile: 330, other: 70 },
	{ date: "2024-05-11", desktop: 335, mobile: 270, other: 60 },
	{ date: "2024-05-12", desktop: 197, mobile: 240, other: 50 },
	{ date: "2024-05-13", desktop: 197, mobile: 160, other: 30 },
	{ date: "2024-05-14", desktop: 448, mobile: 490, other: 100 },
	{ date: "2024-05-15", desktop: 473, mobile: 380, other: 80 },
	{ date: "2024-05-16", desktop: 338, mobile: 400, other: 90 },
	{ date: "2024-05-17", desktop: 499, mobile: 420, other: 110 },
	{ date: "2024-05-18", desktop: 315, mobile: 350, other: 70 },
	{ date: "2024-05-19", desktop: 235, mobile: 180, other: 40 },
	{ date: "2024-05-20", desktop: 177, mobile: 230, other: 50 },
	{ date: "2024-05-21", desktop: 82, mobile: 140, other: 20 },
	{ date: "2024-05-22", desktop: 81, mobile: 120, other: 15 },
	{ date: "2024-05-23", desktop: 252, mobile: 290, other: 60 },
	{ date: "2024-05-24", desktop: 294, mobile: 220, other: 50 },
	{ date: "2024-05-25", desktop: 201, mobile: 250, other: 40 },
	{ date: "2024-05-26", desktop: 213, mobile: 170, other: 30 },
	{ date: "2024-05-27", desktop: 420, mobile: 460, other: 90 },
	{ date: "2024-05-28", desktop: 233, mobile: 190, other: 40 },
	{ date: "2024-05-29", desktop: 78, mobile: 130, other: 20 },
	{ date: "2024-05-30", desktop: 340, mobile: 280, other: 70 },
	{ date: "2024-05-31", desktop: 178, mobile: 230, other: 50 },
	{ date: "2024-06-01", desktop: 178, mobile: 200, other: 40 },
	{ date: "2024-06-02", desktop: 470, mobile: 410, other: 80 },
	{ date: "2024-06-03", desktop: 103, mobile: 160, other: 25 },
	{ date: "2024-06-04", desktop: 439, mobile: 380, other: 90 },
	{ date: "2024-06-05", desktop: 88, mobile: 140, other: 20 },
	{ date: "2024-06-06", desktop: 294, mobile: 250, other: 60 },
];

export default function Page() {
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
				<div
					className="flex flex-1 flex-col"
					style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
				>
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
							<div className="px-4 lg:px-6">
								<ChartAreaInteractive title="Revenus" data={chartData} />
							</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
