import { Box } from '@chakra-ui/react'
import { json } from '@remix-run/node'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import { useState } from 'react'
import { SeatArrangement } from '~/original-components'
import Seat from '~/original-components/Seat'
import styles from '~/styles/input_seats_amount.module.css'
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
    return json({ usrId, classId, seatsDat })
}

export default function Index() {
    // とりあえずクエリを取り出す
    const query: any = useLoaderData()

    return (
        <>
            <Box className='mx-auto'>
                <SelectableSeatSet usrId={query.usrId} classId={query.classId} defaultseats={query.seatsDat}  />
            </Box>
        </>
    )
}
