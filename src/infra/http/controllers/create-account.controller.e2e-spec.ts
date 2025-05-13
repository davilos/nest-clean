import { AppModule } from "@/infra/app.module";

import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import request from "supertest";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create account (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		await app.init();
	});

	it("/POST accounts", async () => {
		const response = await request(app.getHttpServer()).post("/accounts").send({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "johndoe123",
		});

		expect(response.statusCode).toBe(201);

		const userExists = await prisma.user.findUnique({
			where: {
				email: "johndoe@example.com",
			},
		});

		expect(userExists).toBeTruthy();
	});

	afterAll(async () => {
		await app.close();
	});
});
