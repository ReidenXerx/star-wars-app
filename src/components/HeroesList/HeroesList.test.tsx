import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeroesList from './HeroesList'
import { fetchHeroes } from '../../services/api'
import { useInfiniteQuery } from 'react-query'
import { Hero } from '../../types'

jest.mock('../../services/api')
jest.mock('react-query')

const mockFetchHeroes = fetchHeroes as jest.Mock
const mockUseInfiniteQuery = useInfiniteQuery as jest.Mock

const mockHeroesData = {
  pages: [
    {
      results: [
        { id: 1, name: 'Luke Skywalker' },
        { id: 2, name: 'Darth Vader' },
      ],
      next: 'https://swapi.dev/api/people/?page=2',
    },
    {
      results: [
        { id: 3, name: 'Leia Organa' },
        { id: 4, name: 'Obi-Wan Kenobi' },
      ],
      next: null,
    },
  ],
}

beforeEach(() => {
  mockUseInfiniteQuery.mockReturnValue({
    data: mockHeroesData,
    fetchNextPage: jest.fn(),
    hasNextPage: true,
    isFetchingNextPage: false,
    status: 'success',
  })

  mockFetchHeroes.mockResolvedValue(mockHeroesData.pages[0])
})

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    root: Element | null = null
    rootMargin: string = ''
    thresholds: ReadonlyArray<number> = []

    constructor(
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  global.IntersectionObserver = MockIntersectionObserver as any
})

describe('HeroesList Component', () => {
  test('renders loading state correctly', () => {
    mockUseInfiniteQuery.mockReturnValueOnce({
      data: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      status: 'loading',
    })

    render(<HeroesList onSelectHero={jest.fn()} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders error state correctly', () => {
    mockUseInfiniteQuery.mockReturnValueOnce({
      data: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      status: 'error',
    })

    render(<HeroesList onSelectHero={jest.fn()} />)
    expect(screen.getByText('Error loading data')).toBeInTheDocument()
  })

  test('renders list of heroes correctly and handles selection', () => {
    const onSelectHero = jest.fn()
    render(<HeroesList onSelectHero={onSelectHero} />)

    const heroItems = screen.getAllByRole('listitem')
    expect(heroItems).toHaveLength(4)
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Darth Vader')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Luke Skywalker'))
    expect(onSelectHero).toHaveBeenCalledWith({ id: 1, name: 'Luke Skywalker' })
  })

  test('fetches next page when last hero is in view', () => {
    const fetchNextPage = jest.fn()
    const intersectionCallback = jest.fn()

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback.mockImplementation(callback)
      }
      observe() {
        // Simulate the intersection event triggering the callback
        intersectionCallback([
          { isIntersecting: true } as IntersectionObserverEntry,
        ])
      }
      unobserve() {}
      disconnect() {}
    }

    global.IntersectionObserver = MockIntersectionObserver as any

    mockUseInfiniteQuery.mockReturnValueOnce({
      data: mockHeroesData,
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      status: 'success',
    })

    render(<HeroesList onSelectHero={jest.fn()} />)

    expect(intersectionCallback).toHaveBeenCalled()
    expect(fetchNextPage).toHaveBeenCalledTimes(1) // Now fetchNextPage should be called
  })

  test('displays a loading spinner when fetching the next page', () => {
    mockUseInfiniteQuery.mockReturnValueOnce({
      data: mockHeroesData,
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
      status: 'success',
    })

    render(<HeroesList onSelectHero={jest.fn()} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
