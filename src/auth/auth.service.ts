import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

import * as bcryptjs from 'bcryptjs'

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name)
  private userModel: Model<User>) {


  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    try {
      const {password,...userData} = createUserDto;
      const newUser = new this.userModel({
        password:bcryptjs.hashSync(password,10),
        ...userData
      });
       await newUser.save();
       const  {password:_,...user} = newUser.toJSON() ;
       return  user;   

    } catch (error) {
      console.log(error.message);
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} exits`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
