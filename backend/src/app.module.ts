import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { ReadingsModule } from './readings/readings.module.js';

@Module({
  imports: [PrismaModule, ReadingsModule],
})
export class AppModule {}
