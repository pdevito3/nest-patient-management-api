import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { ProblemDetailsConfigService } from './common/problem-details/problem-details-config.service';
import { NotFoundExceptionFilter } from './common/problem-details/not-found.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  
  const problemDetailsConfig = app.get(ProblemDetailsConfigService);
  app.useGlobalFilters(new NotFoundExceptionFilter(problemDetailsConfig));
  
  const config = new DocumentBuilder()
    .setTitle('Patient Management API')
    .setDescription('The Patient Management API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3871);
}
bootstrap();
