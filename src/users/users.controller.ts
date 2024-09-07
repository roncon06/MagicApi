import { Body, Controller, Post, Get, Param, Put, HttpException, HttpStatus, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/roles/decorator.ts/role.decorator";
import { Role } from "src/roles/enums/role.enum";
import { RolesGuard } from "src/roles/role.guard";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags('users')
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findOne(@Param('username') username: string): Promise<User | undefined> {
    const user = await this.usersService.findOne(username);
    return user;
    }

  @Put(':username')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateUser(@Param('username') username: string, @Body() updateUserDto: CreateUserDto) {
    try {
      const updatedUser = await this.usersService.update(username, updateUserDto);
      return {
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':username')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(@Param('username') username: string) {
    try {
      const deletedUser = await this.usersService.delete(username);
      return {
        message: 'User deleted successfully',
        user: deletedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}