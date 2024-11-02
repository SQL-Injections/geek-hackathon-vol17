import React, { useState, useRef, useMemo, useEffect } from 'react'
import Seat from './Seat'
import { Box, Grid } from '@chakra-ui/react'
import { seatMargin, seatSize } from 'app/config'
import { useInteractJS } from '~/utils/hooks'
import { Room } from '~/model/model'

const SeatArrangement = ({
    room,
    onClick,
    handleValueChange,
}: {
    room: Room
    onClick?: () => void
    handleValueChange?: (value: Array<Array<number | boolean>>) => void
}) => {
    const [rowCount, setRowCount] = useState(room.row) // 行数の状態
    const [columnCount, setColumnCount] = useState(room.column) // 列数の状態
    const totalSeats = room.seatAmount
    const containerRef = useRef<HTMLDivElement>(null)
    const [cellWidth, setCellWidth] = useState(0)
    const [disableSeats, setDisableSeats] = useState(
        [...Array(rowCount * columnCount)].map(() => {
            return false
        }),
    )

    // function handleInputChange(array: Array<any>) {
    //     const value = array
    //     //これ毎回処理させるのすごくあれだけど
    //     const send: Array<Array<number | boolean>> = []
    //     console.log(columnCount)
    //     // 2次元配列に変換
    //     for (let i = 0; i < value.length / columnCount; i++) {
    //         send.push(value.slice(i * columnCount, (i + 1) * columnCount))
    //         // 全てt/fをf/tに
    //         for (let j = 0; j < send[i].length; j++) {
    //             send[i][j] = Boolean(1 - Number(send[i][j]))
    //         }
    //     }
    //     handleValueChange(send)
    // }

    // useEffect(() => {
    //     setRowCount(row)
    //     setColumnCount(col)
    //     setDisableSeats(Array(row * col).fill(false)) // ディセーブル状態も更新
    // }, [row, col])

    // useEffect(() => {
    //     handleInputChange(disableSeats)
    // }, [disableSeats])

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
