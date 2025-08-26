import { Prisma, Submission, Form } from "@prisma/client";

export type FormData = {
	title: string;
	description?: string;
	fields: Prisma.InputJsonValue[];
	settings?: Prisma.InputJsonValue;
};

export type PartialFormData = Partial<FormData>;

export type FormsListItem = Prisma.FormGetPayload<{
	select: {
		id: true;
		title: true;
		description: true;
		createdAt: true;
		updatedAt: true;
		_count: { select: { submissions: true } };
	};
}>;

export type FormWithSubmissions = Form & {
	submissions: Submission[];
};

type PaginationMetadata = {
	total: number;
	hasMore: boolean;
};

export type FormsListResult = {
	forms: FormsListItem[];
} & PaginationMetadata;

export type SubmissionData = Prisma.InputJsonValue;

export type SubmissionsListResult = {
	submissions: Submission[];
} & PaginationMetadata;
