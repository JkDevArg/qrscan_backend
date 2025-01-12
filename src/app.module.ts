import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/throttler/throttler.guard';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QrscanModule } from './qrscan/qrscan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.AWS_RDS_HOST,
      port: parseInt(process.env.AWS_RDS_PORT),
      username: process.env.AWS_RDS_USER,
      password: process.env.AWS_RDS_PASSWORD,
      database: process.env.AWS_RDS_DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('THROTTLE_TTL'),
          limit: configService.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    AuthModule,
    UsersModule,
    QrscanModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },],
})
export class AppModule {}