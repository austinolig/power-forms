import { Prisma, Submission } from "@prisma/client";

export type CreateFormData = {
  title: string;
  description?: string;
  fields: Prisma.InputJsonValue[];
  settings?: Prisma.InputJsonValue;
};

export type UpdateFormData = Partial<CreateFormData>;

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

type PaginationMetadata = {
  total: number;
  hasMore: boolean;
};

export type FormsListResult = {
  forms: FormsListItem[];
} & PaginationMetadata;

export type SubmissionsListResult = {
  submissions: Submission[];
} & PaginationMetadata;
