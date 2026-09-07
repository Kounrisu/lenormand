import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // @prisma/adapter-pg@7.10.0 has a bug where opening a second pooled connection
    // concurrently fails Postgres auth (works fine sequentially, or with a bare
    // pg.Pool/Client). Pinning the pool to a single connection avoids it entirely at
    // the cost of serializing concurrent requests — acceptable at this app's scale.
    super({ adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL, max: 1 })) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
