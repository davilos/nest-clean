import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";

import { envSchema } from "./env";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (config) => envSchema.parse(config),
			isGlobal: true,
			cache: true,
		}),
		AuthModule,
		HttpModule,
	],
})
export class AppModule {}
