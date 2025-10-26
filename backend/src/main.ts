import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API CarrosInfo')
    .setDescription('API para gerenciamento de veículos')
    .setVersion('1.0')
    .addTag('veiculos')
    .build();

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3007);
  console.log(`API http://localhost:${process.env.PORT ?? 3007}/veiculos`);
  console.log(`Swagger http://localhost:${process.env.PORT ?? 3007}/api`);
}
bootstrap();
