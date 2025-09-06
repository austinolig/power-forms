import { ControllerRenderProps } from "react-hook-form";
import { Field } from "@/types/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

export function renderField(field: Field, formField: ControllerRenderProps) {
	switch (field.type) {
		case "text":
		case "email":
		case "number":
			return (
				<Input
					{...formField}
					placeholder={field.settings?.placeholder || "Placeholder..."}
					value={formField.value || ""}
					type={field.type}
				/>
			);
		case "textarea":
			return (
				<Textarea
					{...formField}
					placeholder={field.settings?.placeholder || "Placeholder..."}
					rows={field.settings?.rows || 3}
					value={formField.value || ""}
				/>
			);
		case "checkbox":
			return (
				<div className="space-y-3">
					{field.options?.map((option: string) => (
						<FormItem key={option} className="flex items-center gap-3">
							<FormControl>
								<Checkbox
									checked={formField.value?.includes(option) || false}
									onCheckedChange={(checked) => {
										const currentValue = formField.value || [];
										if (checked) {
											formField.onChange([...currentValue, option]);
										} else {
											formField.onChange(
												currentValue.filter((value: string) => value !== option)
											);
										}
									}}
								/>
							</FormControl>
							<FormLabel>{option}</FormLabel>
						</FormItem>
					))}
				</div>
			);
		case "radio":
			return (
				<RadioGroup
					onValueChange={formField.onChange}
					value={formField.value || ""}
					className="flex flex-col"
				>
					{field.options?.map((option: string) => (
						<FormItem key={option} className="flex items-center gap-3">
							<FormControl>
								<RadioGroupItem value={option} />
							</FormControl>
							<FormLabel>{option}</FormLabel>
						</FormItem>
					))}
				</RadioGroup>
			);
		default:
			return <div>Preview: Unhandled field type: {field.type}</div>;
	}
}
