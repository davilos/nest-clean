import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException,
	UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
	constructor(
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body;

		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException("User credentials do not match.");
		}

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException("User credentials do not match.");
		}

		const acessToken = this.jwtService.sign({
			sub: user.id,
		});

		return {
			acess_token: acessToken,
		};
	}
}
