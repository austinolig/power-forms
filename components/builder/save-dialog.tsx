import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "../ui/spinner";
import { createFormAction, updateFormAction } from "@/lib/actions/form";
import type { FormData, PartialFormData } from "@/types/db";
import { Field } from "@/types/field";
import { redirect } from "next/navigation";

interface SaveDialogProps {
	formId?: string;
	formTitle: string;
	formDescription: string;
	fields: Field[];
}

export function SaveDialog({
	formId,
	formTitle,
	formDescription,
	fields,
}: SaveDialogProps) {
	const [isSaving, setIsSaving] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState("");
	const [dialogDescription, setDialogDescription] = useState("");

	const handleSave = async () => {
		setIsSaving(true);

		let result;
		if (formId) {
			// Update existing form
			const formData: PartialFormData = {
				title: formTitle,
				description: formDescription,
				fields: fields,
			};
			result = await updateFormAction(formId, formData);
		} else {
			// Create new form
			const formData: FormData = {
				title: formTitle,
				description: formDescription,
				fields: fields,
			};
			result = await createFormAction(formData);
		}

		setIsSaving(false);

		if (result.success) {
			setDialogTitle("Success");
			setDialogDescription(
				`Successfully ${formId ? "updated" : "saved"} form!`
			);
		} else {
			setDialogTitle("Error");
			setDialogDescription(
				result.error || `Failed to ${formId ? "update" : "save"} form.`
			);
		}

		setDialogOpen(true);
	};

	function handleClose() {
		if (!formId && dialogTitle === "Success") {
			redirect("/");
		}
	}

	return (
		<>
			<Button onClick={handleSave} disabled={isSaving}>
				{isSaving && <Spinner />}
				<span>{formId ? "Update" : "Save"}</span>
			</Button>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild className="w-full">
							<Button onClick={handleClose}>Ok</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
