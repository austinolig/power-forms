import { Builder } from "@/components/builder";

export default async function BuilderPage() {
	return (
		<div className="p-4 m-4 mx-auto max-w-2xl border rounded bg-slate-100">
			<h1 className="mb-4">Builder Page</h1>

			<Builder />
		</div>
	);
}
