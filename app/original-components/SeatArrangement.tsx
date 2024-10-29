import React, { useState, useRef, useMemo, useEffect } from 'react'
import Seat from './Seat'
import { Box, Grid } from '@chakra-ui/react'
import { seatMargin, seatSize } from 'app/config'
import { useInteractJS } from '~/utils/hooks'

const SeatArrangement = ({ row, col, handleValueChange }: { row: number, col: number, handleValueChange: (value: number[]) => void }) => {
    const [rowCount, setRowCount] = useState(row) // 行数の状態
    const [columnCount, setColumnCount] = useState(col) // 列数の状態
    const totalSeats = rowCount * columnCount
    const containerRef = useRef<HTMLDivElement>(null)
    const [cellWidth, setCellWidth] = useState(0)
    const [disableSeats, setDisableSeats] = useState(
        [...Array(rowCount * columnCount)].map(() => {
            return false
        }),
    )

    console.log(handleValueChange)

    function handleInputChange( array : Array<any>) {
        const value = array;
        handleValueChange(value);
    }

    useEffect(() => {
        setRowCount(row);
        setColumnCount(col);
        setDisableSeats(Array(row * col).fill(false)); // ディセーブル状態も更新
        handleInputChange(disableSeats);
        console.log(disableSeats);
    }, [row, col]);

    const seatPositions = useMemo(() => {
        return Array.from({ length: totalSeats }, (_, index) => {
            const row = Math.floor(index / columnCount)
            const col = index % columnCount
            const x = col * (seatSize + seatMargin)
            const y = row * (seatSize + seatMargin)
            return { x, y }
        })
    }, [columnCount, rowCount, cellWidth])

    return (
        <Box ref={containerRef} maxWidth='100%' maxHeight='100%' mx='auto'>
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
                {[...Array(totalSeats)].map((_, index) => {
                    return (
                        <Box
                            key={index}
                            // ref={interact.ref}
                            margin={seatMargin}
                            // style={{
                            //   ...interact.style,
                            // }}

                            onClick={() => {
                                setDisableSeats((prev) => {
                                    const newEnableSeats = [...prev]
                                    newEnableSeats[index] = !newEnableSeats[index]
                                    return newEnableSeats
                                })
                            }}
                        >
                            <Seat text={(index + 1).toString()} isDisabled={disableSeats[index]} />
                        </Box>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default SeatArrangement
