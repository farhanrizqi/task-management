import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './tasks/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot(AppDataSource.options)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
