import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: '073e114e-af32-434e-92c9-50cf14e81ed0',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        //Debe ser único
        unique: true
    })
    title: string
    //number no es soportado por postgres
    @ApiProperty({
        example: 0,
        description: 'Product Prize'
    })
    @Column('float', {
        default: 0
    })
    price: number
    //Otra forma de definir
    @ApiProperty({
        example: 'Designed for comfort, the Cybertruck Owl Tee is made from 100% cotton and features our signature Cybertruck icon on the back.',
        description: 'Product description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product slug - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number
    //array de string
    @ApiProperty({
        example: ['S', 'XL', 'L'],
        description: 'Product size'
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: 'Women',
        description: 'Gender'
    })
    @Column('text')
    gender: string

    @ApiProperty({
        example: ['shirt'],
        description: 'Product Tag',
        default: []
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @ManyToOne(
        //Se relaciona con la tabla User
        () => User,
        //Como se relaciona ese usuario con esta tabla
        ( user ) => user.product,
        //Carga la relación automático
        { eager: true }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if( !this.slug ) this.slug = this.title

        this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'')
    }
}
