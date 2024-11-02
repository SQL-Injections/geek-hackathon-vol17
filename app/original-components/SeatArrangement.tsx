import React, { useState, useRef, useMemo, useEffect } from 'react'
import Seat from './Seat'
import { Box, Grid } from '@chakra-ui/react'
import { seatMargin, seatSize } from 'app/config'
// import { useInteractJS } from '~/utils/hooks'
import { Room } from '~/model/model'

const SeatArrangement = ({
    room,
    onClick,
}: {
    room: Room
    onClick?: (rowCountIndex: number, columnIndex: number) => void
}) => {
    const rowCount = room.row
    const columnCount = room.column
    const totalSeats = room.seatAmount
    const seatArray = room.seats

    // const [cellWidth, setCellWidth] = useState(0)

    // const seatPositions = useMemo(() => {
    //     return Array.from({ length: totalSeats }, (_, index) => {
    //         const row = Math.floor(index / columnCount)
    //         const col = index % columnCount
    //         const x = col * (seatSize + seatMargin)
    //         const y = row * (seatSize + seatMargin)
    //         return { x, y }
    //     })
    // }, [columnCount, rowCount, cellWidth])

    return (
        <Box maxWidth='100%' maxHeight='100%' mx='auto'>
            <Grid className='w-fit' justifyContent='center' templateColumns={`repeat(${columnCount}, 1fr)`}>
                {/* {seatPositions.map((position, index) => {
          const interact = useInteractJS(position)

          return (
            <Box
              key={index}
              ref={interact.ref}
              margin={seatMargin}
              style={{
                ...interact.style,
              }}
            >
              <Seat text={(index + 1).toString()} />
            </Box>
          )
        })}
         */}
                {/* {[...Array(totalSeats)].map((_, index) => {
                    return (
                        <Box
                            key={index}
                            // ref={interact.ref}
                            margin={seatMargin}
                            // style={{
                            //   ...interact.style,
                            // }}

                            onClick={() => {}}
                        >
                            <Seat text={(index + 1).toString()} isDisabled={} />
                        </Box>
                    )
                })} */}

                {seatArray.map((row, rowIndex) =>
                    row.map((seat, colIndex) => (
                        <Box
                            key={`${rowIndex}-${colIndex}`}
                            margin={seatMargin}
                            onClick={onClick ? () => onClick(rowIndex, colIndex) : undefined}
                        >
                            <Seat text={`${rowIndex * columnCount + colIndex + 1}`} isDisabled={!seat} />
                        </Box>
                    )),
                )}
            </Grid>
        </Box>
    )
}

export default SeatArrangement
