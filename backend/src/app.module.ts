import { Module } from '@nestjs/common';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [VehiclesModule],
})
export class AppModule {}
