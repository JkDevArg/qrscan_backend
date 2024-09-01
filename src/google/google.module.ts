import { Module } from "@nestjs/common";
import { GoogleService } from "./google.service";
import { GoogleController } from "./google.controller";
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [GoogleController],
    providers: [GoogleService],
    exports: [GoogleService]
})

export class GptModule {}