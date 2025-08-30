import { Label } from "@/components/ui/label";

interface FieldLabelProps {
	label: string;
	description?: string;
	htmlFor?: string;
}

export function FieldLabel({ label, description, htmlFor }: FieldLabelProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={htmlFor}>{label}</Label>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
		</div>
	);
}
