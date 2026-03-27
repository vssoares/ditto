import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UrlTree } from '@angular/router'

// Mock @angular/core's inject() so we can control what gets injected
vi.mock('@angular/core', async (importOriginal) => {
  const original = await importOriginal<typeof import('@angular/core')>()
  return { ...original, inject: vi.fn() }
})

// Mock @angular/router so createUrlTree produces a testable UrlTree
vi.mock('@angular/router', async (importOriginal) => {
  const original = await importOriginal<typeof import('@angular/router')>()
  return { ...original }
})

import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../services/storage.service'
import { requireAuthGuard, authRedirectGuard } from './auth.guard'

function makeRouter(): Pick<Router, 'createUrlTree'> {
  return {
    createUrlTree: (commands: unknown[]) => {
      const tree = new UrlTree()
      ;(tree as any).fragment = commands.join('/')
      return tree
    },
  }
}

describe('requireAuthGuard', () => {
  let mockStorage: Partial<StorageService>
  let mockRouter: Pick<Router, 'createUrlTree'>

  beforeEach(() => {
    mockStorage = { isAuthenticated: vi.fn() }
    mockRouter = makeRouter()

    vi.mocked(inject).mockImplementation((token: unknown) => {
      if (token === StorageService) return mockStorage
      if (token === Router) return mockRouter
      return null
    })
  })

  it('retorna true quando usuário está autenticado', () => {
    vi.mocked(mockStorage.isAuthenticated!).mockReturnValue(true)
    const result = requireAuthGuard({} as any, {} as any)
    expect(result).toBe(true)
  })

  it('redireciona para /login quando não autenticado', () => {
    vi.mocked(mockStorage.isAuthenticated!).mockReturnValue(false)
    const result = requireAuthGuard({} as any, {} as any)
    expect(result).toBeInstanceOf(UrlTree)
  })

  it('chama isAuthenticated uma vez', () => {
    vi.mocked(mockStorage.isAuthenticated!).mockReturnValue(true)
    requireAuthGuard({} as any, {} as any)
    expect(mockStorage.isAuthenticated).toHaveBeenCalledOnce()
  })
})

describe('authRedirectGuard', () => {
  let mockStorage: Partial<StorageService>
  let mockRouter: Pick<Router, 'createUrlTree'>

  beforeEach(() => {
    mockStorage = { isAuthenticated: vi.fn() }
    mockRouter = makeRouter()

    vi.mocked(inject).mockImplementation((token: unknown) => {
      if (token === StorageService) return mockStorage
      if (token === Router) return mockRouter
      return null
    })
  })

  it('retorna true quando usuário não está autenticado', () => {
    vi.mocked(mockStorage.isAuthenticated!).mockReturnValue(false)
    const result = authRedirectGuard({} as any, {} as any)
    expect(result).toBe(true)
  })

  it('redireciona para /app/generate quando autenticado', () => {
    vi.mocked(mockStorage.isAuthenticated!).mockReturnValue(true)
    const result = authRedirectGuard({} as any, {} as any)
    expect(result).toBeInstanceOf(UrlTree)
  })

  it('chama isAuthenticated uma vez', () => {
    vi.mocked(mockStorage.isAuthenticated!).mockReturnValue(false)
    authRedirectGuard({} as any, {} as any)
    expect(mockStorage.isAuthenticated).toHaveBeenCalledOnce()
  })
})
