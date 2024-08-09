import React, { useEffect, useRef, useCallback } from 'react'
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { useInfiniteQuery } from 'react-query'
import { fetchHeroes } from '../../services/api'
import { Hero, PaginatedResponse } from '../../types'

const HeroesList: React.FC<{ onSelectHero: (hero: Hero) => void }> = ({
  onSelectHero,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<PaginatedResponse<Hero>>(
      'heroes',
      ({ pageParam = 1 }) => fetchHeroes(pageParam),
      {
        getNextPageParam: (lastPage) =>
          lastPage.next
            ? Number(new URL(lastPage.next).searchParams.get('page'))
            : undefined,
      }
    )

  const observerElem = useRef<HTMLLIElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage]
  )

  useEffect(() => {
    if (observerElem.current && hasNextPage && !isFetchingNextPage) {
      const observer = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      })
      observer.observe(observerElem.current)
      return () => observer.disconnect()
    }
  }, [data, handleObserver, hasNextPage, isFetchingNextPage])

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'error') return <div>Error loading data</div>

  return (
    <List style={{ height: '80vh', overflowY: 'auto' }}>
      {data?.pages.map((page, pageIndex) =>
        page.results.map((hero: Hero, heroIndex) => {
          const isLastElement =
            pageIndex === data.pages.length - 1 &&
            heroIndex === page.results.length - 1
          return (
            <ListItem
              key={hero.id}
              onClick={() => onSelectHero(hero)}
              ref={isLastElement ? observerElem : null}
            >
              <ListItemText primary={hero.name} />
            </ListItem>
          )
        })
      )}
      {isFetchingNextPage && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress />
        </Box>
      )}
    </List>
  )
}

export default HeroesList
