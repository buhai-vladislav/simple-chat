import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../db/schemas/User';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/Auth';
import { AuthController } from '../controllers/Auth';
import { JwtStrategy } from '../strategies/JwtStrategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({
      defaultStrategy: ['jwt'],
      property: 'user',
    }),
    JwtModule.register({
      secret: process.env.TOKEN_SECRET || 'SECRET',
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME || '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
