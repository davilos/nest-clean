import {
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UsePipes,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { z } from "zod";

import { PrismaService } from "src/prisma/prisma.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

type CreateAccountBodyChema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodyChema) {
		const { email, name, password } = body;

		const userAlreadyExists = await this.prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});

		if (userAlreadyExists) {
			throw new ConflictException(
				"User with same e-mail address already exists.",
			);
		}

		const hashedPassword = await hash(password, 8);

		await this.prisma.user.create({
			data: {
				email: email,
				name: name,
				password: hashedPassword,
			},
		});
	}
}
