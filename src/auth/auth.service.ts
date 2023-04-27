import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      //extraer password por separado
      const { password, ...userData } = createUserDto

      //proceso para encriptar password
      const user = this.userRepository.create( {
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      } )

      await this.userRepository.save( user )
      delete user.password
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handDBErrors( error )
    }
  }

  async login ( loginUserDto: LoginUserDto )
  {
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if ( !user ) throw new UnauthorizedException('Credentials are not valid')

    if ( !bcrypt.compareSync( password, user.password ) ) throw new UnauthorizedException('Credentials are not valid')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async checkAuthStatus( user: User ){
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken( payload: JwtPayload){
    const token = this.jwtService.sign( payload )
    return token
  }

  private handDBErrors( error: any ) {
    if( error.code === '23505' ) throw new BadRequestException( error.detail )

    console.log( error );
    throw new InternalServerErrorException(' please check server log')
  }
}
