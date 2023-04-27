import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator"

export class CreateProductDto {
    @ApiProperty({
        description: 'Product Title',
        nullable: false,
        minLength: 1,
        example: 'Chill Pullover Hoodie'
    })
    @IsString()
    @MinLength(1)
    title: string

    @ApiProperty({
        description: 'Product prize',
        example: 200
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @ApiProperty({
        description: 'Product description',
        example: "Designed for fit, comfort and style, the Men's 3D Wordmark Long Sleeve Tee is made from 100% cotton and features an understated wordmark logo on the left chest."
    })
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({
        description: 'Product slug',
        example: 'chill_pullover_hoodie'
    })
    @IsString()
    @IsOptional()
    slug?: string

    @ApiProperty({
        description: 'Product stock',
        example: 10
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number
    //Debe ser un array de string
    @ApiProperty({
        description: 'Product size',
        example: ['S', 'L', 'XL']
    })
    @IsString( { each:true } )
    @IsArray()
    sizes: string[]

    @ApiProperty({
        description: 'Gender',
        example: 'women'
    })
    @IsIn( ['men', 'women', 'kid', 'unisex'] )
    gender: string

    @ApiProperty({
        description: 'Product tag',
        example: 'shirt'
    })
    @IsString( { each:true } )
    @IsArray()
    @IsOptional()
    tags:string[]

    @ApiProperty({
        description: 'Product tag',
        example: ['8528839-00-A_0_2000.jpg','7654393-00-A_3.jpg','8764813-00-A_1.jpg']
    })
    @IsString( { each:true } )
    @IsArray()
    @IsOptional()
    images?:string[]
}
