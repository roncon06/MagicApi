import { Delete, HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/shared/utils/appError.exception';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto): Promise<Partial<User>> {
    const userAlreadyExists = await this.findOne(user.username);
    if (userAlreadyExists) {
      throw new AppError({
        id: "USER_ALREADY_EXISTS",
        message: "User already exists",
        status: HttpStatus.BAD_REQUEST
      })
    }
    try {
      const data = {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      };
      const createdUser = await this.userModel.create(data);
      const { password, ...result } = createdUser.toJSON();
      return result;
    } catch (error) {
      throw new AppError({
        id: "USER_CREATION_FAILED",
        message: "User creation failed",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error
      });
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find()
  }


  async update(username: string, updateUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      // Verifica se o usuário já existe
      const user = await this.findOne(username);
      if (!user) {
        throw new AppError({
          id: 'USER_NOT_FOUND',
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      // Atualiza os campos necessários do usuário
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const updatedUser = await this.userModel.findOneAndUpdate(
        { username },
        { $set: updateUserDto },
        { new: true }, // Retorna o documento atualizado
      );

      if (!updatedUser) {
        throw new AppError({
          id: 'USER_UPDATE_FAILED',
          message: 'Failed to update user',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      const { password, ...result } = updatedUser.toObject();
      return result;
    } catch (error) {
      throw new AppError({
        id: 'USER_UPDATE_FAILED',
        message: 'Failed to update user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }

  async delete(username: string): Promise<Partial<User>> {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({ username }).exec();
      if (!deletedUser) {
        throw new AppError({
          id: 'USER_NOT_FOUND',
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }
      const { password, ...result } = deletedUser.toObject();
      return result;
    } catch (error) {
      throw new AppError({
        id: 'USER_DELETION_FAILED',
        message: 'Failed to delete user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }


}