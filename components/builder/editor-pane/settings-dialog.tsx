"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldSettings } from "@/types/field";
import { Settings } from "lucide-react";

interface FieldSettingsDialogProps {
	field: Field;
	onSave: (settings: FieldSettings) => void;
}

export function FieldSettingsDialog({
	field,
	onSave,
}: FieldSettingsDialogProps) {
	const [open, setOpen] = useState(false);
	const [settings, setSettings] = useState<FieldSettings>(field.settings || {});

	const updateSetting = (
		key: keyof FieldSettings,
		value: string | number | string[]
	) => {
		setSettings((prev) => ({
			...prev,
			[key]:
				value === "" || (Array.isArray(value) && value.length === 0)
					? undefined
					: value,
		}));
	};

	const handleSave = () => {
		onSave(settings);
		setOpen(false);
	};

	const renderSettings = () => {
		switch (field.type) {
			case "text":
				return (
					<>
						<div className="space-y-2">
							<Label className="text-sm">Placeholder Text</Label>
							<Input
								value={settings.placeholder || ""}
								onChange={(e) => updateSetting("placeholder", e.target.value)}
								placeholder="Enter placeholder text..."
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-sm">Min Length</Label>
								<Input
									type="number"
									value={settings.minLength || ""}
									onChange={(e) =>
										updateSetting("minLength", parseInt(e.target.value) || "")
									}
									placeholder="0"
									min="0"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm">Max Length</Label>
								<Input
									type="number"
									value={settings.maxLength || ""}
									onChange={(e) =>
										updateSetting("maxLength", parseInt(e.target.value) || "")
									}
									placeholder="No limit"
									min="1"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Pattern (Regex)</Label>
							<Input
								value={settings.pattern || ""}
								onChange={(e) => updateSetting("pattern", e.target.value)}
								placeholder="e.g., [A-Za-z]+"
							/>
						</div>
					</>
				);
			case "email":
				return (
					<>
						<div className="space-y-2">
							<Label className="text-sm">Placeholder Text</Label>
							<Input
								value={settings.placeholder || ""}
								onChange={(e) => updateSetting("placeholder", e.target.value)}
								placeholder="Enter placeholder text..."
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Allowed Domains</Label>
							<Input
								value={settings.allowedDomains?.join(", ") || ""}
								onChange={(e) => {
									const domains = e.target.value
										.split(",")
										.map((d) => d.trim())
										.filter((d) => d.length > 0);
									setSettings((prev) => ({
										...prev,
										allowedDomains: domains.length > 0 ? domains : undefined,
									}));
								}}
								placeholder="e.g., gmail.com, yahoo.com"
							/>
							<p className="text-xs text-muted-foreground">
								Enter domains separated by commas. Leave empty to allow all
								domains.
							</p>
						</div>
					</>
				);
			case "checkbox":
				return (
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm">Min Selections</Label>
							<Input
								type="number"
								value={settings.minSelections || ""}
								onChange={(e) =>
									updateSetting("minSelections", parseInt(e.target.value) || "")
								}
								placeholder="0"
								min="0"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Max Selections</Label>
							<Input
								type="number"
								value={settings.maxSelections || ""}
								onChange={(e) =>
									updateSetting("maxSelections", parseInt(e.target.value) || "")
								}
								placeholder="No limit"
								min="1"
							/>
						</div>
					</div>
				);
			case "number":
				return (
					<>
						<div className="space-y-2">
							<Label className="text-sm">Placeholder Text</Label>
							<Input
								value={settings.placeholder || ""}
								onChange={(e) => updateSetting("placeholder", e.target.value)}
								placeholder="Enter placeholder text..."
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-sm">Min Value</Label>
								<Input
									type="number"
									value={settings.min || ""}
									onChange={(e) =>
										updateSetting("min", parseFloat(e.target.value) || "")
									}
									placeholder="No minimum"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm">Max Value</Label>
								<Input
									type="number"
									value={settings.max || ""}
									onChange={(e) =>
										updateSetting("max", parseFloat(e.target.value) || "")
									}
									placeholder="No maximum"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Step</Label>
							<Input
								type="number"
								value={settings.step || ""}
								onChange={(e) =>
									updateSetting("step", parseFloat(e.target.value) || "")
								}
								placeholder="1"
								min="0"
								step="0.1"
							/>
						</div>
					</>
				);
			case "textarea":
				return (
					<>
						<div className="space-y-2">
							<Label className="text-sm">Placeholder Text</Label>
							<Textarea
								value={settings.placeholder || ""}
								onChange={(e) => updateSetting("placeholder", e.target.value)}
								placeholder="Enter placeholder text..."
								rows={2}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="text-sm">Min Length</Label>
								<Input
									type="number"
									value={settings.minLength || ""}
									onChange={(e) =>
										updateSetting("minLength", parseInt(e.target.value) || "")
									}
									placeholder="0"
									min="0"
								/>
							</div>
							<div className="space-y-2">
								<Label className="text-sm">Max Length</Label>
								<Input
									type="number"
									value={settings.maxLength || ""}
									onChange={(e) =>
										updateSetting("maxLength", parseInt(e.target.value) || "")
									}
									placeholder="No limit"
									min="1"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label className="text-sm">Rows</Label>
							<Input
								type="number"
								value={settings.rows || ""}
								onChange={(e) =>
									updateSetting("rows", parseInt(e.target.value) || "")
								}
								placeholder="3"
								min="1"
								max="20"
							/>
						</div>
					</>
				);
			default:
				return (
					<div className="space-y-2">
						<Label className="text-sm">Placeholder Text</Label>
						<Input
							value={settings.placeholder || ""}
							onChange={(e) => updateSetting("placeholder", e.target.value)}
							placeholder="Enter placeholder text..."
						/>
					</div>
				);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Settings className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Field Settings</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">{renderSettings()}</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
