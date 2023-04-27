import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validRoles } from 'src/auth/interfaces';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiCreatedResponse({ description: 'Product was created', type: Product })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Fordibben. Token related' })
  @ApiBearerAuth('JWT-auth')
  create(
    @Body() createProductDto: CreateProductDto,
    //Para obtener el usuario
    @GetUser() user: User ) {
    //Enviar el usuario
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      allOf: [
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(Product) },
            },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productsService.findAll( paginationDto );
  }

  @Get(':term')
  @ApiOkResponse({ description: 'Response ok', type: Product })
  @ApiNotFoundResponse({ description: 'Product with id/title not found' })
  findOne(@Param( 'term' ) term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth( validRoles.admin )
  @ApiOkResponse({ description: 'Response ok', type: Product })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Product with id not found' })
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth( validRoles.admin )
  @ApiOkResponse({ description: 'Response ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Product with id not found' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id', ParseUUIDPipe) id: string ) {
    return this.productsService.remove(id);
  }
}
