import { Box } from '@chakra-ui/react'
import { json } from '@remix-run/node'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import styles from '~/styles/write_my_seats.module.css'
import SelectableSeatSet from '~/original-components/SelectableSeatSet'
import { getClassById, idToClassSeats } from './assets/class_dat'
import { useNavigate } from '@remix-run/react'
import { requireUserSession } from './assets/student_auth.server'
import { Student } from '~/model/model'

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
    const fetch = useLoaderData<typeof loader>()
    const navigate = useNavigate()

    const seatDat = fetch.seatsDat
    if (!seatDat) {
        return <div>loading...</div>
    }

    const student: Student = { id: fetch.usrId, displayName: fetch.usrName, uuid: fetch.usrUuid }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log('submit', '\n\n\n\n')
        event.preventDefault()
        navigate(`/write_my_seats`)
    }

    return (
        <>
            <div className={styles.seats_container} style={{ display: 'block' }}>
                <div className={styles.seats_amount_text}>
                    {fetch.seatsDat.finished
                        ? '席替えは終了しました'
                        : '自身が移動したい席を選択してください(色の薄い席は無効です)'}
                </div>
                <div className={styles.seats}>
                    <Box className={`mx-auto ${styles.seats_boxes}`}>
                        <SelectableSeatSet
                            key={JSON.stringify(fetch.seatsDat)}
                            user={student}
                            classUuid={fetch.classUuid}
                            defaultSeats={fetch.seatsDat}
                        />
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
