import { ApiProperty } from "@nestjs/swagger";

export class CheckStatusDto {
    @ApiProperty({
        description: 'id único',
        example: 'da3707e4-7bb7-4b4d-b8e8-d3906ca73ac3'
    })
    id: string

    @ApiProperty({
        description: 'User email',
        example: 'user@email.cl'
    })
    email: string

    @ApiProperty({
        description: 'User full name',
        example: 'Juan Lee'
    })
    fullname: string

    @ApiProperty({
        description: 'is User active?',
        example: 'true'
    })
    isActive: boolean

    @ApiProperty({
        description: 'User rol',
        isArray: true,
        type: String,
        example: ['user', 'admin']
    })
    roles: string[]

    @ApiProperty({
        description: 'Security token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRhMzcwN2U0LTdiYjctNGI0ZC1iOGU4LWQzOTA2Y2E3M2FjMyIsImlhdCI6MTY4MjM4MjIwNSwiZXhwIjoxNjgyMzg1ODA1fQ.NezEFmgJgrCtNshRsSssQb1Fj_aqlVgH3YxhHG9w29U'
    })
    token: string
}