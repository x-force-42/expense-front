import { apiClient } from '@/shared/lib/apiClient'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO, ICategoryRepository } from '../types'

interface ApiCategoryResponse {
  id: string
  name: string
  color: string
  icon: string
}

function toCategory(r: ApiCategoryResponse): Category {
  return {
    id: r.id,
    name: r.name,
    color: r.color,
    icon: r.icon,
  }
}

export class ApiCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<Category[]> {
    const data = await apiClient.get<ApiCategoryResponse[]>('/api/v1/categories')
    return data.map(toCategory)
  }

  async getById(id: string): Promise<Category | null> {
    const all = await this.getAll()
    return all.find(c => c.id === id) || null
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    const body = {
      name: data.name,
      color: data.color,
      icon: data.icon,
    }
    const r = await apiClient.post<ApiCategoryResponse>('/api/v1/categories', body)
    return toCategory(r)
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const body = {
      name: data.name,
      color: data.color,
      icon: data.icon,
    }
    const r = await apiClient.put<ApiCategoryResponse>(`/api/v1/categories/${id}`, body)
    return toCategory(r)
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/categories/${id}`)
  }
}

export function createCategoryRepository(): ICategoryRepository {
  return new ApiCategoryRepository()
}
