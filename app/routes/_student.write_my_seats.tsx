import { Box } from '@chakra-ui/react'
import { json } from '@remix-run/node'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, Form, useFetcher } from '@remix-run/react'
import styles from '~/styles/write_my_seats.module.css'
import { getClassById, idToClassSeats } from './assets/class_dat'
import { useNavigate } from '@remix-run/react'
import { requireUserSession } from './assets/student_auth.server'
import { Room, Seat, Student } from '~/model/model'
import { SeatArrangement } from '~/original-components'
import { useEffect, useState } from 'react'

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
    // sessionからデータを取り出す
    const data = await requireUserSession(request)
    const { usrId, usrUuid, classUuid, usrName } = data

    const seatsDat = await idToClassSeats(classUuid)
    return json({ usrId, usrUuid, classUuid, usrName, seatsDat })
}

export default function Index() {
    // とりあえずクエリを取り出す
    const { usrId, usrUuid, classUuid, usrName, seatsDat } = useLoaderData<typeof loader>()
    const navigate = useNavigate()
    const fetcher = useFetcher()
    const [room, setRoom] = useState<Room>(seatsDat)

    const student: Student = { id: usrId, displayName: usrName, uuid: usrUuid }

    const onClick = (rowCountIndex: number, columnIndex: number) => {
        console.log(rowCountIndex, columnIndex)
        if (room.finished) return

        fetcher.submit(
            { user: student, classUuid: classUuid, x: columnIndex, y: rowCountIndex, function: 'modifyClass' },
            { method: 'post', action: `/class_dat`, encType: 'application/json' },
        )
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            const seats: Array<Array<Seat>> = fetcher.data as Array<Array<Seat>>
            setRoom((prevRoom) => {
                const newRoom = { ...prevRoom }
                newRoom.seats = seats
                return newRoom
            })
        }
    }, [fetcher.data])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('submit', '\n\n\n\n')
        event.preventDefault()
        navigate(`/write_my_seats`)
    }

    return (
        <>
            <div className={styles.seats_container} style={{ display: 'block' }}>
                <div className={styles.seats_amount_text}>
                    {seatsDat.finished
                        ? '席替えは終了しました'
                        : '自身が移動したい席を選択してください(色の薄い席は無効です)'}
                </div>
                <div className={styles.seats}>
                    <Box className={`mx-auto ${styles.seats_boxes}`}>
                        <SeatArrangement room={room} onClick={onClick} />
                    </Box>
                </div>
                <Form onSubmit={handleSubmit}>
                    <button type='submit' className={styles.seats_submit_button}>
                        更新
                    </button>
                </Form>
            </div>
        </>
    )
}
