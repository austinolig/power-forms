"use client";

import React, { useState } from "react";

type Field = {
	id: string;
	type: string;
	label: string;
};

function EditorField({ field }: { field: Field }) {
	if (field.type === "text") {
		return (
			<div className="py-4 flex flex-col gap-2">
				<label htmlFor={field.id}>{field.label}</label>
				<input
					className="w-full border rounded bg-white p-2"
					type="text"
					name={field.id}
				/>
			</div>
		);
	}

	if (field.type === "checkbox") {
		return (
			<div className="py-4 flex flex-col gap-2">
				<p>{field.label}</p>
				<div className="flex flex-col">
					<div>
						<input
							className="border bg-white"
							type="checkbox"
							name={field.id}
						/>
						<label className="ml-2" htmlFor={field.id}>
							Option 1
						</label>
					</div>
					<div>
						<input
							className="border bg-white"
							type="checkbox"
							name={field.id}
						/>
						<label className="ml-2" htmlFor={field.id}>
							Option 2
						</label>
					</div>
					<div>
						<input
							className="border bg-white"
							type="checkbox"
							name={field.id}
						/>
						<label className="ml-2" htmlFor={field.id}>
							Option 3
						</label>
					</div>
				</div>
			</div>
		);
	}

	if (field.type === "radio") {
		return (
			<div className="py-4 flex flex-col gap-2">
				<p>{field.label}</p>
				<div className="flex flex-col">
					<div>
						<input className="border bg-white" type="radio" name={field.id} />
						<label className="ml-2" htmlFor={field.id}>
							Option 1
						</label>
					</div>
					<div>
						<input className="border bg-white" type="radio" name={field.id} />
						<label className="ml-2" htmlFor={field.id}>
							Option 2
						</label>
					</div>
					<div>
						<input className="border bg-white" type="radio" name={field.id} />
						<label className="ml-2" htmlFor={field.id}>
							Option 3
						</label>
					</div>
				</div>
			</div>
		);
	}
}

export function Builder() {
	const [fields, setFields] = useState<Field[]>([]);

	const handleAddField = (type: string) => {
		const newField: Field = {
			id: crypto.randomUUID(),
			type: type,
			label: type.charAt(0).toUpperCase() + type.slice(1),
		};
		setFields((prevFields) => [...prevFields, newField]);
	};

	return (
		<div className="space-y-4">
			{fields.length === 0 && (
				<>
					<p className="text-muted-foreground">
						No fields added yet. Use the buttons below to add fields.
					</p>
					<div className="flex gap-4">
						<button
							className="p-4 border rounded bg-slate-50"
							onClick={() => handleAddField("text")}
						>
							Add Text Field
						</button>
						<button
							className="p-4 border rounded bg-slate-50"
							onClick={() => handleAddField("checkbox")}
						>
							Add Checkbox
						</button>
						<button
							className="p-4 border rounded bg-slate-50"
							onClick={() => handleAddField("radio")}
						>
							Add Radio
						</button>
					</div>
				</>
			)}
			{fields.map((field) => (
				<React.Fragment key={field.id}>
					<div className="border p-4 rounded bg-slate-50">
						<p className="text-muted-foreground">[{field.type}]</p>
						<EditorField field={field} />
					</div>
					<div className="flex gap-4">
						<button
							className="p-4 border rounded bg-slate-50"
							onClick={() => handleAddField("text")}
						>
							Add Text Field
						</button>
						<button
							className="p-4 border rounded bg-slate-50"
							onClick={() => handleAddField("checkbox")}
						>
							Add Checkbox
						</button>
						<button
							className="p-4 border rounded bg-slate-50"
							onClick={() => handleAddField("radio")}
						>
							Add Radio
						</button>
					</div>
				</React.Fragment>
			))}
		</div>
	);
}
