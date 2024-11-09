import { json, useFetcher, useLoaderData, Form } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { SeatArrangement, AdminLogout as Logout } from '~/original-components'
import { idToClassSeats } from './assets/class_dat'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireUserSession } from './assets/admin_auth.server'
import { getClassList } from './assets/admin_dat'
import { getStudentList } from './assets/student_dat'
import { Room, Seat } from '~/model/model'
import styles from '~/styles/write_my_seats.module.css'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const data = await requireUserSession(request)
    const adminUuid = data.usrUuid
    const classList = await getClassList(adminUuid)
    const classId = params.class_id || ''
    const existClass = classList.find((cls) => cls.id === classId)
    if (!existClass) {
        return json({ classUuid: '', room: null, studentList: [] })
    }
    const classUuid = existClass.uuid

    const room = await idToClassSeats(classUuid)

    return json({ classUuid, room })
}

export default function Index() {
    const { classUuid, room: r } = useLoaderData<typeof loader>()

    if (!r) {
        return (
            <Box className='mx-auto'>
                <Text>クラスを作成してください。</Text>
            </Box>
        )
    }

    const [finished, setFinished] = useState(r?.finished || false)
    const [room, setRoom] = useState<Room>(r)
    const fetcher = useFetcher<{ seat: Seat[][]; finished: boolean }>()

    const handleFinish = () => {
        fetcher.submit(
            {
                classUuid: classUuid,
                function: 'handleFinishedSeats',
            },
            { method: 'post', action: `/class_dat`, encType: 'application/json' },
        )
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        console.log('fetcher.data', fetcher.data)
        if (fetcher.data) {
            const { seat, finished } = fetcher.data
            setFinished(finished)
            setRoom((prevRoom) => ({
                ...prevRoom,
                seats: seat,
                finished: finished,
            }))
        }
    }, [fetcher.data])
    return (
        <div className={styles.seats_container} style={{ display: 'block' }}>
            <div className={styles.seats}>
                <Box className={`mx-auto ${styles.seats_boxes}`}>
                    <SeatArrangement room={room} />
                </Box>
            </div>
            {finished ? (
                <Button
                    onClick={handleFinish}
                    className={styles.seats_submit_button}
                    type='submit'
                    colorScheme='teal'
                    mt={4}
                >
                    座席配置を編集
                </Button>
            ) : (
                <Button
                    onClick={handleFinish}
                    className={styles.seats_submit_button}
                    type='submit'
                    colorScheme='teal'
                    mt={4}
                >
                    座席配置を確定
                </Button>
            )}
            <button type='button' className={styles.loginbutton}>
                <a href={`/management_classes`}>戻る</a>
            </button>
        </div>
    )
}
