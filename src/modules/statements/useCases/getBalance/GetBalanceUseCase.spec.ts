import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it('should be able to get a balance', async () => {
    const user = await usersRepository.create({
      name: 'User test',
      email: 'user@email.com',
      password: '123456'
    });

    const statementDeposit = await statementsRepository.create({
      user_id: user.id as string,
      description: 'deposit',
      amount: 100,
      type: OperationType.DEPOSIT
    });

    const statementWithdraw = await statementsRepository.create({
      user_id: user.id as string,
      description: 'withdraw',
      amount: 50,
      type: OperationType.WITHDRAW
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(response).toStrictEqual({
      statement: [statementDeposit, statementWithdraw],
      balance: 50
    });
  });

  it('should not be able to get a balance with a non-existent user', async () => {
    expect(async () => {
      await statementsRepository.create({
        user_id: 'non-existent',
        description: 'test',
        amount: 100,
        type: OperationType.DEPOSIT
      });

      await getBalanceUseCase.execute({
        user_id: 'non-existent'
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
