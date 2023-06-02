import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

import { User } from './entities/user.entity';


import { CreateUserDto, LoginDto, RegisterUserDto, UpdateUserDto } from './dto';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name)
  private userModel: Model<User>,
  private jwtService: JwtService,  

  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();
      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} exits`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }


 

  async register(registerDTO: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDTO);
    return {
      user: user,
      token: this.jwtService.sign({ id: user._id })
    };
  }


  async login(loginDTO: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Credenciales no validas");
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException("Credenciales no validas password");
    }
    const { password: _, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJWT({ id: user.id })
    }
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async findUserById(id: string) {

    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;

  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
