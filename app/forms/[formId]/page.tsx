import { notFound } from "next/navigation";
import { getFormWithSubmissions } from "@/lib/db";
import { FormSubmission } from "@/components/form-submission";
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
		<FormSubmission
			formId={form.id}
			title={form.title}
			description={form.description || ""}
			fields={(form.fields as Field[]) || []}
		/>
	);
}
