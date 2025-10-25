import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehiclesRepository } from './vehicles.repository';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesRepository, PrismaService],
})
export class VehiclesModule {}
