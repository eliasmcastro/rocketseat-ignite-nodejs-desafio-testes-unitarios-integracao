import { User } from '../entities/User';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';

export interface IUsersRepository {
  create: (data: ICreateUserDTO) => Promise<User>;

  findById: (user_id: string) => Promise<User | undefined>;

  findByEmail: (email: string) => Promise<User | undefined>;
}
