export interface User {
  id: string
  name: string
  email: string
  avatar: string
  token: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  user: {
    id: string
    email: string
    name: string
    pictureUrl: string | null
  }
}

export interface DashboardSummary {
  totalAmount: number
  currentMonthAmount: number
  expenseCount: number
  byCategory: CategoryTotal[]
}

export interface CategoryTotal {
  category: string
  total: number
}
