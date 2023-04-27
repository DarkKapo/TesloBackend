import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto, LoginOkDto, CheckStatusDto, PrivateResponse, Private3Response } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { validRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'Product was created', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login ok', type: LoginOkDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Credentials are not valid' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }

  @Get('check-status')
  @Auth()
  @ApiOkResponse({ description: 'Check ok', type: CheckStatusDto })
  @ApiUnauthorizedResponse({ description: 'Token invalid' })
  @ApiBearerAuth('JWT-auth')
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus( user )
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  @ApiOkResponse({ description: 'OK', type: PrivateResponse })
  @ApiUnauthorizedResponse({ description: 'Credentials are not valid' })
  @ApiBearerAuth('JWT-auth')
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ){
    return{
      ok: true,
      message: 'Hola mundo pv',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  @RoleProtected( validRoles.superUser, validRoles.admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  @ApiOkResponse({ description: 'OK', type: LoginOkDto })
  @ApiUnauthorizedResponse({ description: 'Credentials are not valid' })
  @ApiBearerAuth('JWT-auth')
  privateRoute2(
    @GetUser() user: User
  ){
    return{
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( validRoles.admin )
  @ApiOkResponse({ description: 'OK', type: Private3Response })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth('JWT-auth')
  privateRoute3(
    @GetUser() user: User
  ){
    return{
      ok: true,
      user
    }
  }
}
