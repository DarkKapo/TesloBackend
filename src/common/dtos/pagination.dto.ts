import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({
        default: 10, description: 'How mane rows do you need?'
    })
    @IsOptional()
    @IsPositive()
    //Convertir a número
    @Type( () => Number )
    limit?: number

    @ApiProperty({
        default: 0, description: 'How mane rows do you have skip?'
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number )
    offset?: number
}