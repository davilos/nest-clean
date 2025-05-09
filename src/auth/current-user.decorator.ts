import { createParamDecorator } from "@nestjs/common";
import { UserPayload } from "./jwt.strategy";

export const CurrentUser = createParamDecorator((_, context) => {
	const request = context.switchToHttp().getRequest();

	return request.user as UserPayload;
});
