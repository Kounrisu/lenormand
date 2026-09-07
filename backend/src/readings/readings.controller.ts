import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service.js';
import type { CreateReadingDto } from './readings.types.js';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  create(@Body() body: Partial<CreateReadingDto>) {
    if (typeof body.deviceId !== 'string' || body.deviceId.length === 0) {
      throw new BadRequestException('deviceId is required');
    }
    if (!Number.isInteger(body.ringPosition) || body.ringPosition! < 1 || body.ringPosition! > 36) {
      throw new BadRequestException('ringPosition must be an integer between 1 and 36');
    }
    if (body.answer !== 'yes' && body.answer !== 'no') {
      throw new BadRequestException('answer must be "yes" or "no"');
    }
    if (body.question !== null && body.question !== undefined && typeof body.question !== 'string') {
      throw new BadRequestException('question must be a string or null');
    }

    return this.readingsService.create({
      deviceId: body.deviceId,
      question: body.question ?? null,
      ringPosition: body.ringPosition!,
      answer: body.answer,
    });
  }

  @Get()
  list(@Query('deviceId') deviceId?: string) {
    if (!deviceId) {
      throw new BadRequestException('deviceId query param is required');
    }
    return this.readingsService.listForDevice(deviceId);
  }
}
