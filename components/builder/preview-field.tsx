import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldLabel } from "./field-label";

export type Field = {
	id: string;
	type: string;
	label: string;
	description?: string;
	options?: string[];
	required?: boolean;
};

interface PreviewFieldProps {
	field: Field;
}

export function PreviewField({ field }: PreviewFieldProps) {
	switch (field.type) {
		case "text":
			return <TextPreviewField field={field} />;
		case "number":
			return <NumberPreviewField field={field} />;
		case "email":
			return <EmailPreviewField field={field} />;
		case "textarea":
			return <TextareaPreviewField field={field} />;
		case "checkbox":
			return <CheckboxPreviewField field={field} />;
		case "radio":
			return <RadioPreviewField field={field} />;
		default:
			return null;
	}
}

export function TextPreviewField({ field }: PreviewFieldProps) {
	return (
		<div className="space-y-2">
			<FieldLabel
				label={field.label}
				description={field.description}
				htmlFor={field.id}
			/>
			<Input
				id={field.id}
				name={field.id}
				placeholder="Enter text..."
				required={field.required}
			/>
		</div>
	);
}

export function NumberPreviewField({ field }: PreviewFieldProps) {
	return (
		<div className="space-y-2">
			<FieldLabel
				label={field.label}
				description={field.description}
				htmlFor={field.id}
			/>
			<Input
				id={field.id}
				name={field.id}
				type="number"
				placeholder="Enter number..."
				required={field.required}
			/>
		</div>
	);
}

export function EmailPreviewField({ field }: PreviewFieldProps) {
	return (
		<div className="space-y-2">
			<FieldLabel
				label={field.label}
				description={field.description}
				htmlFor={field.id}
			/>
			<Input
				id={field.id}
				name={field.id}
				type="email"
				placeholder="Enter email..."
				required={field.required}
			/>
		</div>
	);
}

export function TextareaPreviewField({ field }: PreviewFieldProps) {
	return (
		<div className="space-y-2">
			<FieldLabel
				label={field.label}
				description={field.description}
				htmlFor={field.id}
			/>
			<Textarea
				id={field.id}
				name={field.id}
				placeholder="Enter text..."
				required={field.required}
			/>
		</div>
	);
}

export function CheckboxPreviewField({ field }: PreviewFieldProps) {
	const options = field.options || [];
	return (
		<div className="space-y-2">
			<FieldLabel label={field.label} description={field.description} />
			<div className="space-y-2">
				{options.map((option, index) => (
					<div key={index} className="flex items-center space-x-2">
						<Checkbox
							id={`${field.id}-${index}`}
							name={field.id}
							required={field.required}
						/>
						<Label htmlFor={`${field.id}-${index}`}>{option}</Label>
					</div>
				))}
			</div>
		</div>
	);
}

export function RadioPreviewField({ field }: PreviewFieldProps) {
	const options = field.options || [];
	return (
		<div className="space-y-2">
			<FieldLabel label={field.label} description={field.description} />
			<RadioGroup name={field.id} required={field.required}>
				{options.map((option, index) => (
					<div key={index} className="flex items-center space-x-2">
						<RadioGroupItem
							value={`option${index + 1}`}
							id={`${field.id}-option${index + 1}`}
						/>
						<Label htmlFor={`${field.id}-option${index + 1}`}>{option}</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	);
}
