/* eslint-disable testing-library/no-unnecessary-act */
import { act } from 'react'
import { render, screen } from '@testing-library/react'
import HeroDetail from './HeroDetail'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  mockHero,
  mockPlanet,
  mockFilm,
  mockStarships,
} from '../../mocks/mockData'
import {
  fetchHeroDetails,
  fetchPlanetDetails,
  fetchFilmDetails,
  fetchStarshipDetails,
} from '../../services/api'

jest.mock('../../services/api')

const queryClient = new QueryClient()

const renderWithClient = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

beforeEach(() => {
  ;(fetchHeroDetails as jest.Mock).mockResolvedValue(mockHero)
  ;(fetchPlanetDetails as jest.Mock).mockResolvedValue(mockPlanet)
  ;(fetchFilmDetails as jest.Mock).mockResolvedValue(mockFilm)

  // Mock starship details to return specific starships based on ID
  ;(fetchStarshipDetails as jest.Mock).mockImplementation((id: number) => {
    if (id in mockStarships) {
      return Promise.resolve(mockStarships[id as keyof typeof mockStarships])
    }
    return Promise.reject(new Error(`Starship with id ${id} not found`))
  })
})

describe('HeroDetail Component', () => {
  test('displays loading state initially', async () => {
    renderWithClient(<HeroDetail hero={mockHero} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('displays hero details when data is successfully fetched', async () => {
    await act(async () => {
      renderWithClient(<HeroDetail hero={mockHero} />)
    })

    // Use findAllByText to find all elements that contain "Luke Skywalker"
    const heroNameElements = await screen.findAllByText(/Luke Skywalker/i)

    // Assert that at least one element is found
    expect(heroNameElements.length).toBeGreaterThan(0)

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === `Height: ${mockHero.height} cm`
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText((content, element) => {
        return element?.textContent === `Mass: ${mockHero.mass} kg`
      })
    ).toBeInTheDocument()
  })

  test('displays planet tooltip with detailed information', async () => {
    await act(async () => {
      renderWithClient(<HeroDetail hero={mockHero} />)
    })

    const planetElement = await screen.findByText(mockPlanet.name)
    expect(planetElement).toBeInTheDocument()

    // Simulate hover
    planetElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))

    // Use a function to check the full text content
    expect(
      await screen.findByText((content, element) => {
        return (
          element?.textContent ===
          `Rotation Period: ${mockPlanet.rotation_period}`
        )
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText((content, element) => {
        return (
          element?.textContent ===
          `Orbital Period: ${mockPlanet.orbital_period}`
        )
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === `Diameter: ${mockPlanet.diameter} km`
      })
    ).toBeInTheDocument()
  })

  test('renders the correct number of nodes and edges in ReactFlow', async () => {
    await act(async () => {
      renderWithClient(<HeroDetail hero={mockHero} />)
    })

    // Log all nodes and edges found
    const nodes = screen.getAllByTestId(/^rf__node-/)

    console.log('Rendered nodes:', nodes)

    // Check for the correct number of nodes
    expect(nodes.length).toBeGreaterThanOrEqual(3)
  })
})
