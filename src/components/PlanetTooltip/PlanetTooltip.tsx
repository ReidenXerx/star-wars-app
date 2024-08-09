import React from 'react'
import { Tooltip, Typography } from '@mui/material'
import { Planet } from '../../types'
import theme from '../../theme'

interface PlanetTooltipProps {
  planetName?: string
  planetData?: Planet
}

const PlanetTooltip: React.FC<PlanetTooltipProps> = ({
  planetName,
  planetData,
}) => {
  if (!planetData || planetName === 'unknown') {
    return (
      <Typography variant="body2">
        <strong>Unknown</strong>
      </Typography>
    )
  }

  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography variant="subtitle2" color="inherit">
            {planetData.name}
          </Typography>
          <Typography variant="body2">
            <strong>Rotation Period:</strong> {planetData.rotation_period}
          </Typography>
          <Typography variant="body2">
            <strong>Orbital Period:</strong> {planetData.orbital_period}
          </Typography>
          <Typography variant="body2">
            <strong>Diameter:</strong> {planetData.diameter} km
          </Typography>
          <Typography variant="body2">
            <strong>Climate:</strong> {planetData.climate}
          </Typography>
          <Typography variant="body2">
            <strong>Gravity:</strong> {planetData.gravity}
          </Typography>
          <Typography variant="body2">
            <strong>Terrain:</strong> {planetData.terrain}
          </Typography>
          <Typography variant="body2">
            <strong>Surface Water:</strong> {planetData.surface_water}%
          </Typography>
          <Typography variant="body2">
            <strong>Population:</strong> {planetData.population}
          </Typography>
        </React.Fragment>
      }
      arrow
      placement="top"
    >
      <Typography variant="body2" style={{ color: theme.palette.text.pink }}>
        {planetName}
      </Typography>
    </Tooltip>
  )
}

export default PlanetTooltip
