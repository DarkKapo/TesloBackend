import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  constructor (
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    //Para poder instanciar images, debe estar en el constructor
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    //Se usa para crear la query runner
    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [ ], ...productDetails} = createProductDto
      //Crea la instancia del producto
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create( { url:image }) ),
        user
      })
      //Guardar en DB
      await this.productRepository.save( product )
      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll( paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });
    //Se iteran los productos 
    //devuelve todas las propiedades del producto
    //el atributo images devuelve solo el url
    return products.map( product => ({
      ...product,
      images: product.images.map( img => img.url )
    }))
  }

  async findOne( term: string ) {
    let product: Product

    if( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term })
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod')
      product = await queryBuilder.where('UPPER(title) =:title or slug=:slug', { 
        title: term.toUpperCase(), 
        slug : term.toLowerCase()
      }).leftJoinAndSelect('prod.images','prodImages').getOne();
    }

    if( !product ) throw new NotFoundException(`Product with id ${ term } not found`)
    
    return product
  }

  async findOnePlain( term: string ) {
    const { images = [], ...rest } = await this.findOne(term)
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    //Trabajamos las imágenes por separado
    const { images, ...toUpdate } = updateProductDto
    const product = await this.productRepository.preload({ id: id, ...toUpdate })

    if( !product ) throw new NotFoundException(`Product with id ${ id } not found`)
    //Con query runner haremos las transacciones
    const queryRunner = this.dataSource.createQueryRunner()
    //Conectar a DB para iniciar la transacción
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      //Borrar imágenes anteriores
      if( images ) {
        //Borrar las ProductImages cuya columna productId (product) sea igual al id
        await queryRunner.manager.delete( ProductImage, { product: { id } } )
        //Guardar imágenes
        product.images = images.map( image => this.productImageRepository.create( { url: image } ) )
      }
      //Actualiza el userId
      product.user = user
      //Intenta guardar, Hacer commit
      await queryRunner.manager.save( product )
      await queryRunner.commitTransaction()
      //liberar queryRunner,Retornar el texto plano
      await queryRunner.release()
      return this.findOnePlain( id )
    } catch (error) {
      //Si hay un error hacer un rollback
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDBExceptions(error)
    }

    return product
  }

  async remove(id: string) {
    const product = await this.findOne( id )
    await this.productRepository.remove( product )
  }

  private handleDBExceptions ( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException(error.detail)
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  //Crear un delete All para trabajar mejor en el seed
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')

    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
}
