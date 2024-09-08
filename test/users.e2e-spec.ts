import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { Role } from 'src/roles/enums/role.enum';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  const mockUser = {
    _id: '1',
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    role: Role.User
  };

  const updatedMockUser = {
    _id: '1',
    username: 'updateduser',
    email: 'updateduser@example.com',
    password: 'newpassword123',
    role: Role.User
  };

  const mockUserModel = {
    create: jest.fn().mockImplementation((user) => {
      if (user.username === mockUser.username) {
        throw { code: 'USER_ALREADY_EXISTS', message: 'User already exists' };
      }
      return mockUser;
    }),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findByIdAndUpdate: jest.fn().mockResolvedValue(updatedMockUser),
    findOneAndDelete: jest.fn().mockResolvedValue(mockUser),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

 

  it('/users (POST)', async () => {
    const CreateUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      role: "user"
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(CreateUserDto)
      .expect(400) // Espera um Bad Request porque o usuário já existe
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'User already exists');
      });
  });

  it('/users/:username (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/users/${mockUser.username}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('username', mockUser.username);
        expect(res.body).toHaveProperty('email', mockUser.email);
      });
  });



  });


  

