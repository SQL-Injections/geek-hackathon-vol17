import { Box } from '@chakra-ui/react'
import { json } from '@remix-run/node'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import styles from '~/styles/write_my_seats.module.css'
import SelectableSeatSet from '~/original-components/SelectableSeatSet'
import { isToClassSeats } from './assets/class_dat'


export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url)
    const usrId = url.searchParams.get('usr_id')?.toString() as string
    const classId = url.searchParams.get('class_id')?.toString() as string
    const seatsDat = await isToClassSeats(classId)
    console.log("seatsDat", seatsDat);
    return json({ usrId, classId, seatsDat })
}

export default function Index() {
    // とりあえずクエリを取り出す
    const query: any = useLoaderData()

    return (
        <>
            <div className={styles.seats_container} style={{ display: 'block' }}>
                <div className={styles.seats_amount_text}>自身が移動したい席を選択してください(色の薄い席は無効です)</div>
                <div className={styles.seats}>
                    <Box className={`mx-auto ${styles.seats_boxes}`}>
                        <SelectableSeatSet usrId={query.usrId} classId={query.classId} defaultseats={query.seatsDat}  />
                        </Box>
                </div>
            </div>
        </>
    )
}
