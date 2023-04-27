import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  //Instanciar el productServices
  constructor(
    private readonly productService: ProductsService,
    //Para eliminar la tabla usuarios
    @InjectRepository( User )
    private readonly userRepository: Repository<User>
  ){}
  //Seed para llenar DB
  async runSeed(){
    await this.deleteTables()
    //guardamos el usuario que hace el insert
    const adminUser = await this.insertUsers()
    //enviamos el usuario a insertProduct
    await this.insertNewProducts( adminUser )
    return "Seed OK"
  }

  //Procedimiento para limpiar la DB
  private async deleteTables(){
    //Eliminar productos
    await this.productService.deleteAllProducts()
    //Eliminar usuarios
    const queryBuilder = this.userRepository.createQueryBuilder()
    await queryBuilder.delete().where({}).execute()
  }

  private async insertUsers(){
    //Traer los usuaros de initialData
    const seedUsers = initialData.users
    //array para crear los usuarios
    const users: User[] = []

    seedUsers.forEach( user => {
      //Prepara el usuario para grabarlo
      users.push( this.userRepository.create( user ) )
    })
    //guardar el usuario
    const dbUsers =  await this.userRepository.save( seedUsers )
    //Devolver el primer usuario para enviar el insertUser a insertProduct
    return dbUsers[0]
  }

  private async insertNewProducts( user: User ){
    //Antes de insertar se limpia la DB
    await this.productService.deleteAllProducts()
    const products = initialData.products

    const insertPromises = []
    //Resuelve las promesas
    products.forEach( product => {
      insertPromises.push( this.productService.create( product, user ) )
    })
    //Inserta las promesas
    await Promise.all( insertPromises )
    return true
  }
}
