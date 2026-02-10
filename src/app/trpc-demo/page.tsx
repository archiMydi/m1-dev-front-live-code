"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";

function PageContent() {
	const [data] = trpc.example.useSuspenseQuery({ name: "foo" });

	return <div>Data: {JSON.stringify(data)}</div>;
}

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PageContent />
		</Suspense>
	);
}
