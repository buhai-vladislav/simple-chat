import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Auth';
import { ChatModule } from './Chat';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@${process.env.MONGO_INITDB_HOST}:${process.env.MONGO_INITDB_PORT}`,
    ),
    AuthModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src/client/build'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {
  static port: number;

  constructor() {
    ApplicationModule.port = Number.parseInt(process.env.SERVICE_PORT) || 3000;
  }
}
