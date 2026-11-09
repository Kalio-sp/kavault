import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Разрешаем запросы от любых клиентов (браузер, Electron, iPhone по Wi-Fi)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Слушаем на 0.0.0.0, чтобы iPhone в локальной сети мог обращаться к API
  await app.listen(4000, '0.0.0.0');
  console.log('🚀 KAVAULT Backend запущен на http://0.0.0.0:4000');
}
bootstrap();
