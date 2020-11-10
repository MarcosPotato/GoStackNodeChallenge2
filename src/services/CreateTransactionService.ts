// import AppError from '../errors/AppError';
import { v4 } from 'uuid'
import { getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError'
import Transaction from '../models/Transaction'

import CatergoriesRepository from '../repositories/CategoriesRepository'
import TransactionRepository from '../repositories/TransactionsRepository'

interface NewTransaction{
  title: string,
  value: number,
  type: "income" | "outcome",
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category } :NewTransaction): Promise<Transaction> {
    
    const transactionsRepository = getCustomRepository(TransactionRepository)
    const categoriesRepository = getCustomRepository(CatergoriesRepository)

    if(value <= 0){
      throw new AppError("You can't add negative values or Zero (nothing)", 400)
    }

    if(!(type == "income" || type == "outcome")){
      throw new AppError("Invalid type", 400)
    }

    const transaction = {
      id: v4(),
      title,
      value,
      type,
      category: {},
      created_at: new Date(),
      updated_at: new Date(),
    }

    const exists = await categoriesRepository.findCategory(category)
    
    if(exists){
      transaction.category = exists
    } else{
      const newCategory = categoriesRepository.create({
        id: v4(),
        title: category, 
        created_at: new Date(),
        updated_at: new Date(),
      })

      await categoriesRepository.save(newCategory)

      transaction.category = newCategory
    }

    await transactionsRepository.save(transaction)

    const newTransaction: Transaction = {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      category_id: transaction.category.id,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at
    }

    return newTransaction
  }
}

export default CreateTransactionService;
