import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../db/schemas/User';
import { CreateUserDto } from '../dtos/CreateUser';
import { ResponseBody, SignInResult } from '../types/Response';
import { Hashing } from '../utils/Hashing';
import { ResponseResult } from '../utils/Response';
import { Response } from 'express';
import { JwtPayload } from '../types/JwtPayload';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from '../dtos/Signin';

@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto - The user data to create.
   * @param {Response} res - The response object.
   * @return {Promise<Response<ResponseBody>>} The response with the created user.
   */
  public async signup(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    try {
      const { email, name, password } = createUserDto;
      const passHash = await Hashing.generatePasswordHash(password);

      const user = await this.userModel.create({
        email,
        name,
        password: passHash,
      });

      const { password: _, ...result } = user.toObject();

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User created successfully.',
        result,
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Sign in a user.
   *
   * @param {SigninDto} signinDto - the signin data
   * @param {Response} res - the response object
   * @return {Promise<any>} a promise that resolves to the response result
   */
  public async signin(
    signinDto: SigninDto,
    res: Response,
  ): Promise<Response<ResponseBody<SignInResult>>> {
    try {
      const { email, password } = signinDto;
      const user = await this.userModel.findOne({
        $and: [{ email: { $eq: email } }],
      });

      if (!user) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User not found.',
        );
      }

      const isMatch = await Hashing.checkPassword(password, user.password);

      if (!isMatch) {
        return ResponseResult.sendError(
          res,
          HttpStatus.UNAUTHORIZED,
          'Email or password is incorrect.',
        );
      }
      const { password: _, ...newUser } = user.toObject();
      const payload: JwtPayload = { id: user._id.toString(), email };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        secret: process.env.TOKEN_SECRET,
      });

      return ResponseResult.sendSuccess<SignInResult>(
        res,
        HttpStatus.OK,
        'User found successfully.',
        {
          user: newUser,
          accessToken,
        },
      );
    } catch (error) {
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }

  /**
   * Verifies a token.
   *
   * @param {string} token - The token to be verified.
   * @returns {Promise<JwtPayload>} The payload of the verified token.
   */
  public async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECRET,
      });

      if (!payload) {
        throw new BadRequestException('Token is expired.');
      }

      return payload;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * Retrieves the user information with the specified user ID.
   *
   * @param {string} userId - The ID of the user to retrieve.
   * @param {Response} res - The response object to send the result to.
   * @return {Promise<void>} A promise that resolves when the user information is retrieved and the response is sent.
   */
  public async getSelf(userId: string, res: Response) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return ResponseResult.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User not found.',
        );
      }
      const { password: _, ...result } = user.toObject();

      return ResponseResult.sendSuccess(
        res,
        HttpStatus.OK,
        'User found successfully.',
        result,
      );
    } catch (error) {
      this.logger.error(error);
      return ResponseResult.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error.',
        error?.message ?? error,
      );
    }
  }
}
