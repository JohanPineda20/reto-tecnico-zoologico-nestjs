import { Transform } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";
import { trimString } from "src/common/validations/validations";

export class CreateCommentDto {
    @Transform(({ value }) => trimString(value))
    @IsString()
    @MinLength(1, { message: 'body must have at least 1 character' })
    @MaxLength(250, { message: 'body must have a maximum of 250 characters' })
    body: string;
}
