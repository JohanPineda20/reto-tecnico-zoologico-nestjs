import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, Matches, MinLength } from "class-validator";
import { trimString } from "src/common/validations/validations";

export class CreateAreaDto {
    @ApiProperty({ example: 'Reptiles', description: 'The name of the area' })
    @Transform(({ value }) => trimString(value))
    @IsString()
    @MinLength(1, { message: 'name must have at least 1 digits' })
    @Matches(/^[a-zA-Z]+$/, { message: 'name must contain only letters' })
    name: string;
}
