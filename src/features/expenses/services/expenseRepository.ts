import { apiClient } from '@/shared/lib/apiClient'
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO, IExpenseRepository } from '../types'

interface ApiExpenseResponse {
  id: string
  date: string
  value: number
  categoryId: string
  categoryName: string
  partnerId: string | null
  partnerName: string | null
  description: string
  createdAt: string
}

function toExpense(r: ApiExpenseResponse): Expense {
  return {
    id: r.id,
    date: r.date,
    value: r.value,
    categoryId: r.categoryId,
    partnerId: r.partnerId,
    description: r.description,
    createdAt: r.createdAt,
  }
}

export class ApiExpenseRepository implements IExpenseRepository {
  async getAll(): Promise<Expense[]> {
    const data = await apiClient.get<ApiExpenseResponse[]>('/api/v1/expenses')
    return data.map(toExpense)
  }

  async getById(id: string): Promise<Expense | null> {
    const all = await this.getAll()
    return all.find(e => e.id === id) || null
  }

  async create(data: CreateExpenseDTO): Promise<Expense> {
    const body = {
      date: data.date,
      value: data.value,
      categoryId: data.categoryId,
      partnerId: data.partnerId || null,
      description: data.description,
    }
    const r = await apiClient.post<ApiExpenseResponse>('/api/v1/expenses', body)
    return toExpense(r)
  }

  async update(id: string, data: UpdateExpenseDTO): Promise<Expense> {
    const body = {
      date: data.date,
      value: data.value,
      categoryId: data.categoryId,
      partnerId: data.partnerId || null,
      description: data.description,
    }
    const r = await apiClient.put<ApiExpenseResponse>(`/api/v1/expenses/${id}`, body)
    return toExpense(r)
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/expenses/${id}`)
  }

  async deleteBatch(ids: string[]): Promise<void> {
    await apiClient.post('/api/v1/expenses/batch-delete', { ids })
  }

  async importBatch(items: CreateExpenseDTO[]): Promise<Expense[]> {
    const body = items.map(item => ({
      date: item.date,
      value: item.value,
      categoryId: item.categoryId,
      partnerId: item.partnerId || null,
      description: item.description,
    }))
    const data = await apiClient.post<ApiExpenseResponse[]>('/api/v1/expenses/import', body)
    return data.map(toExpense)
  }

  async exportAll(): Promise<Expense[]> {
    const data = await apiClient.get<ApiExpenseResponse[]>('/api/v1/expenses/export')
    return data.map(toExpense)
  }
}

export function createExpenseRepository(): IExpenseRepository {
  return new ApiExpenseRepository()
}
