import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';
import { UserModule } from './modules/user/user.module';
import { ItemModule } from './modules/item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Dynamically select the file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('TypeOrmModule', config.get<string>('TYPEORM_DATABASE'));
        return {
          keepConnectionAlive: true,
          type: 'postgres',
          host: config.get<string>('TYPEORM_HOST'),
          port: config.get<number>('TYPEORM_PORT'),
          username: config.get<string>('TYPEORM_USERNAME'),
          password: config.get<string>('TYPEORM_PASSWORD'),
          database: config.get<string>('TYPEORM_DATABASE'),
          synchronize: config.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
          entities: [__dirname + '/entities/*.entity.js'], // Ensure correct path for entities
          migrations: [__dirname + '/migrations/*.js'], // Correct migrations path
          subscribers: [__dirname + '/subscribers/*.js'], // Correct subscribers path
          migrationsRun:
            config.get<string>('TYPEORM_MIGRATIONS_RUN') === 'true',
          dropSchema:
            config.get<string>('NODE_ENV') === 'test' &&
            config.get<string>('TYPEORM_DROP_SCHEMA') === 'true',
          logging: config.get<string>('TYPEORM_LOGGING') === 'true',
          autoLoadEntities: true, // Automatically load entities (optional, for simplicity)
        };
      },
    }),
    GroupModule,
    UserModule,
    ItemModule,
  ],
})
export class AppModule {}
