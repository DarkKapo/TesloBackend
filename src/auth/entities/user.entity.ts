import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User {
    @ApiProperty({
        description: 'id único',
        uniqueItems: true,
        type: String,
        example: 'da3707e4-7bb7-4b4d-b8e8-d3906ca73ac3'
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        description: 'User email',
        nullable: false,
        example: 'user@email.cl',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string

    @ApiProperty({
        description: 'User password',
        minLength: 6,
        maxLength: 50,
        example: 'FirstPassword1'
    })
    @Column('text', {
        select: false
    })
    password: string

    @ApiProperty({
        description: 'user full name',
        minLength: 1,
        example: 'Juanito Perez'
    })
    @Column('text')
    fullname: string

    @ApiProperty({
        description: 'is user active?',
        type: Boolean,
        default: 'true',
        example: 'true'
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean

    @ApiProperty({
        description: 'user rol',
        isArray: true,
        type: String,
        example: ['user', 'admin']
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]

    @OneToMany(
        //Se relaciona con la tabla Product
        () => Product,
        //Como se relaciona ese producto con esta tabla
        ( product ) => product.user
    )
    product: Product

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim()
    }
}
