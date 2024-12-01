import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exceptions/filter';
import { Transport } from '@nestjs/microservices';
import { queueConstants } from './queue/constants';
import metadata from './metadata';

function bootstrap() {
  NestFactory.create(AppModule).then((app) => {
    app.enableCors({
      origin: [
        'https://portal-wepgcomp-client-development.vercel.app',
        'https://portal-wepgcomp-client.vercel.app',
        `http://localhost:${process.env.FRONTEND_LOCAL_PORT}`
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    });
  
    const config = new DocumentBuilder()
      .setTitle('Documentação de Rotas do PortalWEPGCOMP')
      .setDescription(
        'Especificação e descrição das rotas da API do projeto PortalWEPGCOMP.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.loadPluginMetadata(metadata).then(() => {
      const documentFactory = () => SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, documentFactory, {
        customSiteTitle: 'Api Docs',
        customJs: [
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
        customCssUrl: [
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
        ],
      });
    });
  
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
  
    for (const queue of queueConstants.queues) {
      app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: queue,
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      });
    }
  
    app.startAllMicroservices().then(() => {
      app.listen(process.env.PORT ?? 3000).then(() => {});
    });
  });
}
bootstrap();
