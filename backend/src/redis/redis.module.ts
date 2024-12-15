import { Module } from '@nestjs/common';
import { RedisThrottlerStorageService } from './redis-throttler-storage.service';

@Module({
  providers: [RedisThrottlerStorageService],
  exports: [RedisThrottlerStorageService], // Exporta o serviço para outros módulos
})
export class RedisModule {}
