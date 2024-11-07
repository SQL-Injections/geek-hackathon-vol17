import { json, useFetcher, useLoaderData, Form } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { SeatArrangement, AdminLogout as Logout } from '~/original-components'
import { idToClassSeats } from './assets/class_dat'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireUserSession } from './assets/admin_auth.server'
import { getClassList } from './assets/admin_dat'
import { getStudentList } from './assets/student_dat'
import { Room } from '~/model/model'
import styles from '~/styles/show_class_id.module.css'

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const data = await requireUserSession(request)
    const adminId = data.usrId

    const classListPromise = getClassList(adminId)
    const classList = await classListPromise

    const classId = params.class_id || ''
    const existClass = classList.find((cls) => cls.id === classId)


    if (!existClass) {
        return json({ classId, room: null, studentList: [] })
    }

    const room = idToClassSeats(classId)
    const studentListPromise = getStudentList(classId)
    const studentList = await studentListPromise

    return json({ classId, room, studentList })
}

export default function Index() {
    const { classId, room: r, studentList } = useLoaderData<typeof loader>()

    if (!r) {
        return (
            <Box className='mx-auto'>
                <Text>クラスを作成してください。</Text>
            </Box>
        )
    }
    return (
        <>
            <table>
                <caption>classID : {classId}</caption>
                <div className={styles.flex_box}>
                    {studentList.map((classes) => (
                        <>
                        <tr>
                            <td>{classes.id}</td>
                            <td>{classes.displayName}</td>
                        </tr>
                        </>
                    ))}
                </div>
            </table>
            <button type='button' className={styles.back_btn}>
                <a href={`/management_classes`}>戻る</a>
            </button>
        </>
    )
}
