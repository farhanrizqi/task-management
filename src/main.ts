import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { HttpExceptionFilter } from './http-exception.filter';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // !Global Middleware
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor);
  app.useGlobalFilters(new HttpExceptionFilter);

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // !Global Middleware

  await app.listen(3000);

  // * Other Global Middleware logic
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  //   exceptionFactory: (errors) => {
  //     return new BadRequestException(
  //       errors.map((error) => ({
  //         property: error.property,
  //         constraints: error.constraints,
  //       })),
  //     );
  //   },
  // }))
}

// ! Data source Initialization
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

bootstrap();
