import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDTO {
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    limit?: number;
}