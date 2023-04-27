import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator"

export class CreateUserDto {
    @ApiProperty({
        description: 'User email',
        nullable: false,
        example: 'user@email.cl',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'User password',
        minLength: 6,
        maxLength: 50,
        example: 'FirstPassword1'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'user full name',
        minLength: 1,
        example: 'Juanito Perez'
    })
    @IsString()
    @MinLength(1)
    fullname: string
}