import { AppModule } from "@/app.module";

import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

import request from "supertest";
import { PrismaService } from "@/prisma/prisma.service";
import { hash } from "bcryptjs";

describe("Authenticate (E2E)", () => {
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

	it("/POST sessions", async () => {
		await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@example.com",
				password: await hash("johndoe123", 8),
			},
		});

		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "johndoe@example.com",
			password: "johndoe123",
		});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			acess_token: expect.any(String),
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
