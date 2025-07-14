import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { compare, hash } from "bcryptjs";

export class BcryptHasher implements HashGenerator, HashCompare {
	private saltRounds = 8;

	hash(plain: string): Promise<string> {
		return hash(plain, this.saltRounds);
	}

	compare(plain: string, hash: string): Promise<boolean> {
		return compare(plain, hash);
	}
}
