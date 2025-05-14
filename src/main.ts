import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan'
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'))

  app.useGlobalPipes( new ValidationPipe({
      whitelist: true, // Ignora campos que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envía un campo extra
      transform: true, // Transforma automáticamente tipos (string a number, etc.)
    }),
  );

  const corsOptions: CorsOptions = {
    origin: '*', 
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    
  };

  const config = new DocumentBuilder()
                 .setTitle('Tarifas API')
                 .setDescription('Tarifas CRUD')
                 .setVersion('0.1')
                 .addTag('tarifas')
                 .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api',app,documentFactory)

  app.enableCors(corsOptions)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
