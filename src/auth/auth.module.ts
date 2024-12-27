import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}