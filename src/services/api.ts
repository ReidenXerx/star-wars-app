import axios from 'axios'
import { Hero, PaginatedResponse, Film, Starship, Planet } from '../types'

const API_BASE_URL = 'https://sw-api.starnavi.io'

export const fetchHeroes = async (
  page: number
): Promise<PaginatedResponse<Hero>> => {
  const response = await axios.get(`${API_BASE_URL}/people/?page=${page}`)
  return response.data
}

export const fetchHeroDetails = async (heroId: number): Promise<Hero> => {
  const response = await axios.get(`${API_BASE_URL}/people/${heroId}`)
  return response.data
}

export const fetchFilmDetails = async (filmId: number): Promise<Film> => {
  const response = await axios.get(`${API_BASE_URL}/films/${filmId}`)
  return response.data
}

export const fetchStarshipDetails = async (
  starshipId: number
): Promise<Starship> => {
  const response = await axios.get(`${API_BASE_URL}/starships/${starshipId}`)
  return response.data
}

export const fetchPlanetDetails = async (planetId: number): Promise<Planet> => {
  const response = await axios.get(`${API_BASE_URL}/planets/${planetId}`)
  return response.data
}
