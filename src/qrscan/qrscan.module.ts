import { Module } from '@nestjs/common';
import { QrscanService } from './qrscan.service';
import { QrscanController } from './qrscan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Qrscan } from './entities/qrscan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qrscan])],
  controllers: [QrscanController],
  providers: [QrscanService],
})
export class QrscanModule {}
