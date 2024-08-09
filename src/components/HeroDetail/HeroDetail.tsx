import React from 'react'
import { useQuery, useQueries, UseQueryResult } from 'react-query'
import {
  fetchHeroDetails,
  fetchFilmDetails,
  fetchStarshipDetails,
  fetchPlanetDetails,
} from '../../services/api'
import ReactFlow, { Node, Edge } from 'react-flow-renderer'
import { Hero, Film, Starship, Planet } from '../../types'
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material'
import PlanetTooltip from '../PlanetTooltip/PlanetTooltip'

interface HeroDetailProps {
  hero: Hero
}

const HeroDetail: React.FC<HeroDetailProps> = ({ hero }) => {
  const { data: heroData, status: heroFetchStatus } = useQuery<Hero>(
    ['hero', hero.id],
    () => fetchHeroDetails(hero.id)
  )

  const { data: planetData, status: planetFetchStatus } = useQuery<Planet>(
    ['planet', heroData?.homeworld],
    () => fetchPlanetDetails(heroData?.homeworld!),
    { enabled: !!heroData?.homeworld }
  )

  const filmQueries: UseQueryResult<Film>[] = useQueries(
    heroData
      ? heroData.films.map((filmId) => ({
          queryKey: ['film', filmId],
          queryFn: () => fetchFilmDetails(filmId),
        }))
      : []
  ) as UseQueryResult<Film>[]

  const starshipQueries: UseQueryResult<Starship>[] = useQueries(
    filmQueries
      .map((filmQuery) =>
        filmQuery?.data
          ? filmQuery.data.starships.map((starshipId) => ({
              queryKey: ['starship', starshipId],
              queryFn: () => fetchStarshipDetails(starshipId),
            }))
          : []
      )
      .flat()
  ) as UseQueryResult<Starship>[]

  console.log(`data: ${JSON.stringify(heroData)} status: ${heroFetchStatus}`)

  if (heroFetchStatus === 'loading') return <CircularProgress />
  if (heroFetchStatus === 'error') return <div>Error loading hero data</div>

  const nodes: Node[] = []
  const edges: Edge[] = []
  if (heroData) {
    console.log('Generating node for hero:', heroData.name)
    nodes.push({
      id: `hero-${heroData.id}`,
      data: { label: heroData.name },
      position: { x: 250, y: 0 }, // Hero always starts here
    })

    const addedFilms = new Set<number>()

    filmQueries.forEach((filmQuery, index) => {
      if (filmQuery.data && !addedFilms.has(filmQuery.data.id)) {
        addedFilms.add(filmQuery.data.id)
        console.log('Generating node for film:', filmQuery.data.title)

        nodes.push({
          id: `film-${filmQuery.data.id}`,
          data: { label: filmQuery.data.title },
          position: { x: 250, y: 100 * (index + 1) }, // Staggered Y positions
        })

        edges.push({
          id: `e-hero-${heroData.id}-film-${filmQuery.data.id}`,
          source: `hero-${heroData.id}`,
          target: `film-${filmQuery.data.id}`,
        })

        filmQuery.data.starships.forEach((starshipId, starshipIndex) => {
          const starshipQuery = starshipQueries.find(
            (q) => q.data?.id === starshipId
          )

          if (starshipQuery?.data) {
            console.log(
              'Generating node for starship:',
              starshipQuery.data.name
            )

            nodes.push({
              id: `starship-${starshipQuery.data.id}`,
              data: { label: starshipQuery.data.name },
              position: { x: 500, y: 100 * (index + starshipIndex + 1) }, // Adjust position logic if needed
            })

            edges.push({
              id: `e-film-${filmQuery.data.id}-starship-${starshipQuery.data.id}`,
              source: `film-${filmQuery.data.id}`,
              target: `starship-${starshipQuery.data.id}`,
            })
          } else {
            console.log(`Starship with id ${starshipId} not found`)
          }
        })
      }
    })
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardMedia
            component="img"
            alt={heroData?.name}
            height="300"
            image={`https://starwars-visualguide.com/assets/img/characters/${hero.id}.jpg`}
            title={heroData?.name}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {heroData?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Height:</strong> {heroData?.height} cm
            </Typography>
            {heroData?.homeworld && (
              <Typography variant="body2" color="textSecondary">
                <strong>Homeworld:</strong>
                {planetFetchStatus === 'loading' ? (
                  'Loading...'
                ) : (
                  <PlanetTooltip
                    planetName={planetData?.name}
                    planetData={planetData}
                  />
                )}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary">
              <strong>Mass:</strong> {heroData?.mass} kg
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Hair Color:</strong> {heroData?.hair_color}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Skin Color:</strong> {heroData?.skin_color}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Eye Color:</strong> {heroData?.eye_color}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Birth Year:</strong> {heroData?.birth_year}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Gender:</strong> {heroData?.gender}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          style={{ width: '100%', height: '500px' }}
        />
      </Grid>
    </Grid>
  )
}

export default HeroDetail
