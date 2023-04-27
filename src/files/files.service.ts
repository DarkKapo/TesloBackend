import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    getStaticProductImage( imageName: string ){
        //Crea el path que va a devolver
        const path = join( __dirname, '../../static/products', imageName )
        //Verifica si existe el archivo
        if( !existsSync(path) ) throw new BadRequestException( `${ imageName } not found` )
        return path
    }
}
