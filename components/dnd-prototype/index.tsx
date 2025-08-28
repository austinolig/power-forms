"use client";

import React, { useState } from "react";
import {
	DndContext,
	type UniqueIdentifier,
	type DragEndEvent,
} from "@dnd-kit/core";

import { Droppable } from "./droppable";
import { Draggable } from "./draggable";

export function DndPrototype() {
	const containers = ["A", "B", "C"];
	const [parent, setParent] = useState<UniqueIdentifier | null>(null);
	const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;

	function handleDragEnd(event: DragEndEvent) {
		const { over } = event;

		setParent(over ? over.id : null);
	}

	return (
		<DndContext onDragEnd={handleDragEnd}>
			{parent === null ? draggableMarkup : null}

			<div className="flex gap-4 p-4">
				{containers.map((id) => (
					<Droppable key={id} id={id}>
						{parent === id ? draggableMarkup : "Drop here"}
					</Droppable>
				))}
			</div>
		</DndContext>
	);
}
