import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)

  const transactions = await transactionsRepository.find()

  return response.status(200).json(transactions)
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body

  const createTransactionService = new CreateTransactionService()

  const createTransaction = await createTransactionService.execute({
    title, 
    value, 
    type, 
    category
  })

  return response.status(200).json(createTransaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
