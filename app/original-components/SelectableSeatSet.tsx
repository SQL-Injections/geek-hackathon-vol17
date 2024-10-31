import React, { useState, useRef, useMemo, useEffect } from 'react'
import Seat from './Seat'
import { Box, Grid } from '@chakra-ui/react'
import { seatMargin, seatSize } from 'app/config'
import { useFetcher } from '@remix-run/react'

const SelectableSeatSet = ({ usrId, classId, defaultseats } : { usrId: string, classId: string, defaultseats: Array<Array<boolean|Set<string>>> }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    // 1次元に変換する
    const totalSeats = defaultseats.length * defaultseats[0].length
    const columnCount = defaultseats[0].length
    const [enableSeats, setEnableSeats] = useState(
        //seatsの中身を1次元に
        defaultseats.flat(1)
    )
    const fetcher = useFetcher();

    // データ更新時
    //  サーバー側のデータを更新する

    function modifySeats(index : number) {
        // fetcherを使用してユーザーデータを確認
        fetcher.submit({ usrId: usrId, classId: classId, x: Math.floor(index % columnCount), y: Math.floor(index / columnCount), function: "modifyClass" }, { method: "post", action: `/class_dat`, encType: "application/json" });
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            setEnableSeats((fetcher.data as Array<Array<boolean|Set<string>>>).flat(1));
        }
    }, [fetcher.data])

    return (
        <Box ref={containerRef} className='overflow-auto' maxWidth='80%' maxHeight='40%' mx='auto'>
            <Grid className='w-fit' justifyContent='center' templateColumns={`repeat(${columnCount}, 1fr)`}>
                {[...Array(totalSeats)].map((_, index) => {
                    return (
                        <Box
                            //その場所を誰が選択しているかを返す
                            key={ index }
                            margin={seatMargin}
                            onClick={() => modifySeats(index)}
                        >
                            <Seat text={typeof(enableSeats[index]) == "boolean" ? "" : Array.from(enableSeats[index]).join(",")} isDisabled={!enableSeats[index]} />
                        </Box>
                    )
                })}
            </Grid>
        </Box>
    )
}

export default SelectableSeatSet
