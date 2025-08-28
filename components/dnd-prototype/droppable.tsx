import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
	id: string;
	children: React.ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
	});
	const style = {
		color: isOver ? "green" : undefined,
	};

	return (
		<div
			ref={setNodeRef}
			className="w-[300px] h-[300px] bg-slate-100 rounded-lg border-dotted border-2 border-slate-300"
			style={style}
		>
			{children}
		</div>
	);
}
