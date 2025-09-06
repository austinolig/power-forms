import { notFound } from "next/navigation";
import { getFormWithSubmissions } from "@/lib/db";
import { PreviewPane } from "@/components/builder/preview-pane";
import type { Field } from "@/types/field";

interface FormPageProps {
	params: Promise<{ formId: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
	const { formId } = await params;

	const form = await getFormWithSubmissions(formId);

	if (!form) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-2xl mx-auto">
				<PreviewPane
					formId={form.id}
					fields={(form.fields as Field[]) || []}
					title={form.title}
					description={form.description || ""}
					responseMode={true}
				/>
			</div>
		</div>
	);
}
