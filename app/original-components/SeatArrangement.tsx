import React, { useState } from 'react'
import Seat from './Seat'
import { Box, Grid, SimpleGrid } from '@chakra-ui/react'
import { seatMargin } from 'app/config'

const SeatArrangement = () => {
  const [rowCount, setRowCount] = useState(5)
  const [columnCount, setColumnCount] = useState(7)
  const totalSeats = rowCount * columnCount - 4

  return (
    <Box className='overflow-auto' maxWidth={'80%'} maxHeight={'40%'} mx='auto'>
      <Grid templateColumns={`repeat(${columnCount}, 1fr)`} justifyContent='center' mx='auto' width='fit-content'>
        {Array.from({ length: totalSeats }, (_, index) => (
          <Box key={index} margin={seatMargin}>
            <Seat text={(index + 1).toString()} />
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default SeatArrangement
