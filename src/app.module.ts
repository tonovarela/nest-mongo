import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot(),  
    MongooseModule.forRoot(process.env.MONGO_URL,{dbName: process.env.DB_NAME}),    
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
