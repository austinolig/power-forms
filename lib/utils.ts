import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ResponseData } from "@/types/actions";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const successResponse = <T>(data: T): ResponseData<T> => ({
	success: true,
	data,
});

export const errorResponse = (error: string): ResponseData<never> => ({
	success: false,
	error,
});

export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
};

export const formDataToJson = (formData: FormData) => {
	const data: Record<string, string[] | string> = {};

	for (const [key, value] of formData.entries()) {
		const parsedValue = value.toString();
		if (parsedValue === "") continue;

		if (key in data) {
			if (Array.isArray(data[key])) {
				data[key].push(parsedValue);
			} else {
				data[key] = [data[key], parsedValue];
			}
		} else {
			data[key] = parsedValue;
		}
	}

	return data;
};
