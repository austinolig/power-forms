import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldLabel } from "./field-label";
import { Field } from "../field-utils";
import { useState, useEffect, useCallback } from "react";

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

function TextPreviewField({ field }: PreviewFieldProps) {
	const settings = field.settings || {};
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
				placeholder={settings.placeholder || "Enter text..."}
				required={field.required}
				minLength={settings.minLength}
				maxLength={settings.maxLength}
				pattern={settings.pattern}
			/>
		</div>
	);
}

function NumberPreviewField({ field }: PreviewFieldProps) {
	const settings = field.settings || {};
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
				placeholder={settings.placeholder || "Enter number..."}
				required={field.required}
				min={settings.min}
				max={settings.max}
				step={settings.step}
			/>
		</div>
	);
}

function EmailPreviewField({ field }: PreviewFieldProps) {
	const settings = field.settings || {};
	const [emailValue, setEmailValue] = useState<string>("");
	const [error, setError] = useState<string>("");

	const validateEmail = useCallback(
		(email: string) => {
			if (!email) return true; // Empty is valid unless required

			// Basic email format validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return false;
			}

			// Domain validation if allowed domains are specified
			if (settings.allowedDomains && settings.allowedDomains.length > 0) {
				const domain = email.split("@")[1];
				if (!domain) return false;

				const allowedDomains = settings.allowedDomains.map((d) =>
					d.toLowerCase()
				);
				return allowedDomains.includes(domain.toLowerCase());
			}

			return true;
		},
		[settings.allowedDomains]
	);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmailValue(value);

		if (value && !validateEmail(value)) {
			if (settings.allowedDomains && settings.allowedDomains.length > 0) {
				setError(
					`Email must be from one of these domains: ${settings.allowedDomains.join(", ")}`
				);
			} else {
				setError("Please enter a valid email address");
			}
		} else {
			setError("");
		}
	};

	useEffect(() => {
		// Validate on mount if there's an initial value
		if (emailValue && !validateEmail(emailValue)) {
			if (settings.allowedDomains && settings.allowedDomains.length > 0) {
				setError(
					`Email must be from one of these domains: ${settings.allowedDomains.join(", ")}`
				);
			} else {
				setError("Please enter a valid email address");
			}
		}
	}, [emailValue, settings.allowedDomains, validateEmail]);

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
				placeholder={settings.placeholder || "Enter email..."}
				required={field.required}
				value={emailValue}
				onChange={handleEmailChange}
				title={
					settings.allowedDomains && settings.allowedDomains.length > 0
						? `Email must be from one of these domains: ${settings.allowedDomains.join(", ")}`
						: undefined
				}
			/>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
}

function TextareaPreviewField({ field }: PreviewFieldProps) {
	const settings = field.settings || {};
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
				placeholder={settings.placeholder || "Enter text..."}
				required={field.required}
				minLength={settings.minLength}
				maxLength={settings.maxLength}
				rows={settings.rows || 3}
			/>
		</div>
	);
}

function CheckboxPreviewField({ field }: PreviewFieldProps) {
	const options = field.options || [];
	const settings = field.settings || {};
	const minSelections = settings.minSelections;
	const maxSelections = settings.maxSelections;
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const [error, setError] = useState<string>("");

	const handleCheckboxChange = (option: string, checked: boolean) => {
		let newSelected = [...selectedValues];
		if (checked) {
			newSelected.push(option);
		} else {
			newSelected = newSelected.filter((val) => val !== option);
		}
		setSelectedValues(newSelected);

		// Validate selection count
		if (minSelections && newSelected.length < minSelections) {
			setError(
				`Please select at least ${minSelections} option${minSelections > 1 ? "s" : ""}`
			);
		} else if (maxSelections && newSelected.length > maxSelections) {
			setError(
				`Please select at most ${maxSelections} option${maxSelections > 1 ? "s" : ""}`
			);
		} else {
			setError("");
		}
	};

	useEffect(() => {
		// Validate on mount if required and no selections
		if (
			field.required &&
			minSelections &&
			minSelections > 0 &&
			selectedValues.length < minSelections
		) {
			setError(
				`Please select at least ${minSelections} option${minSelections > 1 ? "s" : ""}`
			);
		}
	}, [field.required, minSelections, selectedValues.length]);

	return (
		<div className="space-y-2">
			<FieldLabel label={field.label} description={field.description} />
			<div className="space-y-2">
				{options.map((option, index) => (
					<div key={index} className="flex items-center space-x-2">
						<Checkbox
							id={`${field.id}-${index}`}
							name={field.id}
							required={
								field.required && (!minSelections || minSelections === 0)
							}
							value={option}
							checked={selectedValues.includes(option)}
							onCheckedChange={(checked) =>
								handleCheckboxChange(option, checked as boolean)
							}
							data-min-selections={minSelections}
							data-max-selections={maxSelections}
						/>
						<Label htmlFor={`${field.id}-${index}`}>{option}</Label>
					</div>
				))}
			</div>
			{(minSelections || maxSelections) && (
				<p className="text-xs text-muted-foreground">
					{minSelections && maxSelections
						? `Select between ${minSelections} and ${maxSelections} options`
						: minSelections
							? `Select at least ${minSelections} option${minSelections > 1 ? "s" : ""}`
							: maxSelections
								? `Select at most ${maxSelections} option${maxSelections > 1 ? "s" : ""}`
								: ""}
				</p>
			)}
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
}

function RadioPreviewField({ field }: PreviewFieldProps) {
	const options = field.options || [];
	return (
		<div className="space-y-2">
			<FieldLabel label={field.label} description={field.description} />
			<RadioGroup name={field.id} required={field.required}>
				{options.map((option, index) => (
					<div key={index} className="flex items-center space-x-2">
						<RadioGroupItem
							value={option}
							id={`${field.id}-option${index + 1}`}
						/>
						<Label htmlFor={`${field.id}-option${index + 1}`}>{option}</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	);
}
