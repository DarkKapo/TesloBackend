import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //Obtener metadata del controlador
  constructor(
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //Obtener metadata del controlador
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler() )
    
    if( !validRoles ) return true
    if( validRoles.length === 0 ) return true

    const req = context.switchToHttp().getRequest()
    const user = req.user as User //Usamos entidad User para acceder al rol

    if( !user ) throw new BadRequestException('User not found')

    for (const role of user.roles) {
      if( validRoles.includes( role ) ) return true
    }
     throw new ForbiddenException( `User ${user.fullname} need a role`)
  }
}