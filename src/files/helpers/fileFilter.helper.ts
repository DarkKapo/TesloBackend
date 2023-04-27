export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    //Si no hay imagen, envía un error
    if( !file ) return callback( new Error('File is empty'), false )
    //extrae la extensión del archivo
    const fileExtension = file.mimetype.split('/')[1]
    //Extensiones permitidas
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

    //Validar si la imagen trae alguna extensión
    if( validExtensions.includes( fileExtension ) ) return callback( null, true )
    
    callback(null, false)
}