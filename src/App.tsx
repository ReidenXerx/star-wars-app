import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  Container,
  CssBaseline,
  Grid,
  Typography,
  Paper,
  ThemeProvider,
} from '@mui/material'
import HeroesList from './components/HeroesList/HeroesList'
import HeroDetail from './components/HeroDetail/HeroDetail'
import './App.css'
import { Hero } from './types'
import theme from './theme'

const queryClient = new QueryClient()

const App: React.FC = () => {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Container
          maxWidth="lg"
          style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '5vh',
          }}
        >
          <Typography variant="h3" gutterBottom align="center" color="primary">
            Star Wars Heroes
          </Typography>
          <Grid container spacing={3} style={{ flex: 1 }}>
            <Grid
              item
              xs={4}
              style={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Paper
                elevation={3}
                style={{
                  height: '100%',
                  overflow: 'auto',
                }}
              >
                <HeroesList onSelectHero={setSelectedHero} />
              </Paper>
            </Grid>
            <Grid item xs={8} style={{ height: '100%', overflow: 'auto' }}>
              <Paper
                elevation={3}
                style={{
                  height: '100%',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {selectedHero ? (
                  <HeroDetail hero={selectedHero} />
                ) : (
                  <Typography variant="h6" align="center" color="secondary">
                    No hero selected
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
