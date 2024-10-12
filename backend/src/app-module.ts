import { Module } from '@nestjs/common'
import { AppController } from './controllers/controller'
import { AppService } from './services/service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
