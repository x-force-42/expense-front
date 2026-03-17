import { apiClient } from '@/shared/lib/apiClient'
import type { Partner, CreatePartnerDTO, UpdatePartnerDTO, IPartnerRepository } from '../types'

interface ApiPartnerResponse {
  id: string
  name: string
}

function toPartner(r: ApiPartnerResponse): Partner {
  return {
    id: r.id,
    name: r.name,
  }
}

export class ApiPartnerRepository implements IPartnerRepository {
  async getAll(): Promise<Partner[]> {
    const data = await apiClient.get<ApiPartnerResponse[]>('/api/v1/partners')
    return data.map(toPartner)
  }

  async getById(id: string): Promise<Partner | null> {
    const all = await this.getAll()
    return all.find(p => p.id === id) || null
  }

  async create(data: CreatePartnerDTO): Promise<Partner> {
    const r = await apiClient.post<ApiPartnerResponse>('/api/v1/partners', { name: data.name })
    return toPartner(r)
  }

  async update(id: string, data: UpdatePartnerDTO): Promise<Partner> {
    const r = await apiClient.put<ApiPartnerResponse>(`/api/v1/partners/${id}`, { name: data.name })
    return toPartner(r)
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/partners/${id}`)
  }
}

export function createPartnerRepository(): IPartnerRepository {
  return new ApiPartnerRepository()
}
