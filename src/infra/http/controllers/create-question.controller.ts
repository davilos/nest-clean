import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

import { z } from "zod";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
});

type CreateQuestionBodyChema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(new ZodValidationPipe(createQuestionBodySchema))
		body: CreateQuestionBodyChema,
	) {
		const { content, title } = body;
		const userId = user.sub;

		await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: [],
		});
	}
}
