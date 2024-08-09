import axios from 'axios'
import { Hero, PaginatedResponse, Film, Starship, Planet } from '../types'

export const fetchHeroes = async (
  page: number
): Promise<PaginatedResponse<Hero>> => {
  const response = await axios.get(`people/?page=${page}`)
  return response.data
}

export const fetchHeroDetails = async (heroId: number): Promise<Hero> => {
  const response = await axios.get(`/people/${heroId}`)
  return response.data
}

export const fetchFilmDetails = async (filmId: number): Promise<Film> => {
  const response = await axios.get(`/films/${filmId}`)
  return response.data
}

export const fetchStarshipDetails = async (
  starshipId: number
): Promise<Starship> => {
  const response = await axios.get(`/starships/${starshipId}`)
  return response.data
}

export const fetchPlanetDetails = async (planetId: number): Promise<Planet> => {
  const response = await axios.get(`/planets/${planetId}`)
  return response.data
}
