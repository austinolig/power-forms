jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));
