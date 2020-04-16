import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const newTransaction = new Transaction({ title, value, type });

    const balance = this.transactionsRepository.getBalance();

    if (
      newTransaction.type === 'outcome' &&
      balance.total < newTransaction.value
    ) {
      throw Error('unauthorized transaction due to lack of balance');
    }

    return this.transactionsRepository.create(newTransaction);
  }
}

export default CreateTransactionService;
