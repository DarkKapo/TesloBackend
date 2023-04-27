import { ApiProperty } from "@nestjs/swagger";

export class PrivateResponse {
    @ApiProperty({
        description: 'ok',
        example: true
    })
    ok: string

    @ApiProperty({
        description: 'message',
        example: 'Hola mundo pv'
    })
    message: string

    @ApiProperty({
        description: 'User data',
        type: Object,
        example: {
            id: 'da3707e4-7bb7-4b4d-b8e8-d3906ca73ac3',
            email: 'user@mail.cl',
            fullname: 'Test One',
            isActive: true,
            roles: ['admin', 'user']
        }
    })
    user: object

    @ApiProperty({
        description: 'userEmail',
        example: 'user@mail.cl'
    })
    userEmail: string

    @ApiProperty({
        description: 'Rawheaders',
        isArray: true,
        example: ['accept-encoding', 'User-Agent', 'localhost:3000', 'close']
    })
    rawHeaders: string[]
}