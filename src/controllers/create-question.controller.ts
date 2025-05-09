import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/auth/current-user.decorator";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { UserPayload } from "@/auth/jwt.strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { stringToSlug } from "@/utils/convertToSlug";
import { z } from "zod";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodyChema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private readonly prismaService: PrismaService) {}

	@Post()
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(new ZodValidationPipe(createQuestionBodySchema))
		body: CreateQuestionBodyChema,
	) {
		const { content, title } = body;
		const userId = user.sub;

		const slug = stringToSlug(title);

		await this.prismaService.question.create({
			data: {
				title,
				content,
				authorId: userId,
				slug,
			},
		});
	}
}
