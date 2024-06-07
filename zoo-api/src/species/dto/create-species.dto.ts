import { Transform } from "class-transformer";
import { IsInt, IsPositive, IsString, Matches, Min, MinLength } from "class-validator";
import { trimString } from "src/common/validations/validations";

export class CreateSpeciesDto {
    @Transform(({ value }) => trimString(value))
    @IsString()
    @MinLength(1, { message: 'name must have at least 1 digits' })
    @Matches(/^[a-zA-Z]+$/, { message: 'name must contain only letters' })
    name: string;

    @IsInt({ message: 'parking_id must be a int' })
    @IsPositive({ message: 'parking_id must be a positive number' })
    @Min(1, { message: 'parking_id must be greater than or equal to 1' })
    areaId: number;
}
