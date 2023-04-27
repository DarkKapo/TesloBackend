import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FileUploadDto } from 'src/common/dtos/fileUpdaload.dto';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/index';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  @ApiOkResponse({ description: 'Look image'})
  @ApiBadRequestResponse({ description: 'Imagen not found' })
  findProductImage(
    //Decorador para regresar la imagen
    //Res permite que hagas una respuesta manual
    @Res() res: Response,
    //Decorador para capturar el dato que vine por params
    @Param('imageName') imageName: string
  ){
    //Función que nos retorna el path
    const path = this.filesService.getStaticProductImage( imageName )
    
    res.sendFile( path )
  }

  @Post('product')
  //Interceptor para tomar la variable file
  @UseInterceptors( FileInterceptor('file', {
    //El interceptor ejecuta el validador
    fileFilter: fileFilter,
    //limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  } ))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: FileUploadDto,
  })
uploadFile(@UploadedFile() file) {}
  uploadProductImage( 
    //Decorador para subir imagen
    //Argumento con el archivo a guardar
    @UploadedFile() file: Express.Multer.File ){
      if( !file ) throw new BadRequestException('Must be an image')

      const secureURL = `${this.configService.get('HOST_API')}/files/product/${file.filename}`
    return { secureURL }
  }
}
