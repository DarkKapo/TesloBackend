import { ApiProperty } from "@nestjs/swagger";

export class Private3Response {
    @ApiProperty({
        description: 'ok',
        example: true
    })
    ok: string

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
}