import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar middlewares y pipes PRIMERO
  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora campos que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envía un campo extra
      transform: true, // Transforma automáticamente tipos (string a number, etc.)
    }),
  );

  // 2. Configurar CORS para aceptar localhost y cualquier IP local
  // Para desarrollo, podés simplemente poner "true".
  // Para ser más específico, podés usar una expresión regular.
  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:5173', // Para desarrollo en la misma PC
      /http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173/, // Acepta cualquier IP local en el puerto 5173
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  };
  app.enableCors(corsOptions);

  // 3. Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Tarifas API')
    .setDescription('Tarifas CRUD')
    .setVersion('0.1')
    .addTag('tarifas')
    .build();
  // La función de fábrica para el documento es opcional si no necesitas recrearlo
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 4. Iniciar el servidor UNA SOLA VEZ, AL FINAL
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
  console.log(`🚀 Accessible on your network at: http://<TU_IP_LOCAL>:${PORT}`);
  console.log(`📄 Swagger documentation is available at: http://localhost:${PORT}/api`);
}
bootstrap();