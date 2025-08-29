import { Builder } from "@/components/builder";
import { EditorFormButtons } from "@/components/editor-form-buttons";

export default async function BuilderPage() {
	return (
		<div className="h-screen flex flex-col">
			<div className="p-4 border-b flex justify-between items-center">
				<h1 className="text-xl font-bold">Power Forms</h1>
				<EditorFormButtons />
			</div>
			<div className="flex-1 overflow-hidden">
				<Builder />
			</div>
		</div>
	);
}
