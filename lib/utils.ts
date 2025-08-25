import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResponseData } from "@/types/actions";

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
