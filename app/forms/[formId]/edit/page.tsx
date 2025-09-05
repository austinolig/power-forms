import { notFound } from "next/navigation";
import { getFormWithSubmissions } from "@/lib/db";
import { Builder } from "@/components/builder";
import type { Field } from "@/types/field";

interface EditFormPageProps {
	params: Promise<{ formId: string }>;
}

export default async function EditFormPage({ params }: EditFormPageProps) {
	const { formId } = await params;

	const form = await getFormWithSubmissions(formId);

	if (!form) {
		notFound();
	}

	return (
		<Builder
			initialFormId={form.id}
			initialTitle={form.title}
			initialDescription={form.description || ""}
			initialFields={(form.fields as Field[]) || []}
		/>
	);
}
