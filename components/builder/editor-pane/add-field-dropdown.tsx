import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { getFieldIcon, getFieldTypeName } from "./field-helpers";
import { FIELD_TYPES } from "@/types/field";

interface AddFieldDropdownProps {
	onAddField: (type: string, insertIndex?: number) => void;
	insertIndex?: number;
}

export function AddFieldDropdown({
	onAddField,
	insertIndex,
}: AddFieldDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="gap-2">
					<Plus className="h-4 w-4" />
					Add Field
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{FIELD_TYPES.map((type) => (
					<DropdownMenuItem
						key={type}
						onClick={() => onAddField(type, insertIndex)}
					>
						{getFieldIcon(type)}
						<span className="ml-2">{getFieldTypeName(type)}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
