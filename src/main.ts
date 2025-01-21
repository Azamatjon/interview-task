import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>('PORT')!);
  console.log('PORT: ', port);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
