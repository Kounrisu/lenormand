import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateReadingDto } from './readings.types.js';

const MAX_QUESTION_LENGTH = 200;
const MAX_HISTORY = 100;

@Injectable()
export class ReadingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReadingDto) {
    return this.prisma.reading.create({
      data: {
        deviceId: dto.deviceId,
        question: dto.question?.slice(0, MAX_QUESTION_LENGTH) ?? null,
        ringPosition: dto.ringPosition,
        answer: dto.answer,
      },
    });
  }

  listForDevice(deviceId: string) {
    return this.prisma.reading.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
      take: MAX_HISTORY,
    });
  }
}
