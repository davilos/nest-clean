import { UseCaseError } from "@/core/errors/use-case-error";

export class StudentAlreadyExistsError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Student with "${identifier}" already exists.`);
		this.name = "StudentAlreadyExistsError";
	}
}
