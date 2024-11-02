import { json, useFetcher, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import { SeatArrangement } from '~/original-components'
import { idToClassSeats } from './assets/class_dat'
import { LoaderFunctionArgs } from '@remix-run/node'
import { requireUserSession } from './assets/student_auth.server'
import { getClassList } from './assets/admin_dat'
import { getStudentList } from './assets/student_dat'
import { Room, Student } from '~/model/model'

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

    const [finished, setFinished] = useState(r?.finished || false)
    const [room, setRoom] = useState<Room>(r)
    const fetcher = useFetcher()

    const handleFinish = () => {
        setFinished(true)
        fetcher.submit(
            {
                classId: classId,
                function: 'toggleFinished',
            },
            { method: 'post', action: `/class_dat`, encType: 'application/json' },
        )
        fetcher.submit(
            {
                classId: classId,
                function: 'handleConfirmSeats',
            },
            { method: 'post', action: `/class_dat`, encType: 'application/json' },
        )
    }

    // 席の決定
    const totalSeatAmount = room.seatAmount

    const currentStudentList = room.seats.flatMap((seatRow) =>
        seatRow.flatMap((seat) => (Array.isArray(seat) ? seat : [])),
    )
    console.log(currentStudentList)

    const emptySeatIndices = room.seats.flatMap((seatRow, rowIndex) =>
        seatRow.flatMap((seat, colIndex) => (seat === true ? [{ row: rowIndex, col: colIndex }] : [])),
    )
    console.log(emptySeatIndices)

    // 未選択の学生を格納するリストを初期化
    const unselectedStudents: Student[] = []

    // room.seats を走査して更新
    const updatedSeats = room.seats.map((seatRow, rowIndex) =>
        seatRow.map((seat, colIndex) => {
            if (Array.isArray(seat) && seat.length > 0) {
                // ランダムに一人の学生を選択
                const randomIndex = Math.floor(Math.random() * seat.length)
                const selectedStudent = seat[randomIndex]

                // 残りの学生を未選択リストに追加
                const remainingStudents = seat.filter((_, index) => index !== randomIndex)
                unselectedStudents.push(...remainingStudents)

                // 選ばれた学生で seat を更新
                return [selectedStudent]
            }
            return seat
        }),
    )

    const shuffledEmptySeats = emptySeatIndices.sort(() => Math.random() - 0.5)

    const missingStudents = studentList.filter(
        (student) => !currentStudentList.some((currentStudent) => currentStudent.id === student.id),
    )

    const unregisteredCount = totalSeatAmount - studentList.length
    const unregisteredStudents: Student[] = Array.from({ length: unregisteredCount }, (_, index) => {
        return { id: 'unregistered' + index, displayName: String(index + 1) }
    })

    const studentsToAssign = [...unselectedStudents, ...unregisteredStudents, ...missingStudents]

    // ランダムに割り当て
    shuffledEmptySeats.forEach(({ row, col }) => {
        if (studentsToAssign.length > 0) {
            const student = studentsToAssign.shift() // 割り当てる学生を取り出す
            if (student) {
                updatedSeats[row][col] = [student] // 空席に学生を割り当て
            }
        }
    })

    // 状態更新
    setRoom((prevRoom) => ({
        ...prevRoom,
        seats: updatedSeats,
    }))

    console.log('未選択の学生リスト:', unselectedStudents)
    console.log('更新された room.seats:', room.seats)

    return (
        <Box className='mx-auto'>
            <SeatArrangement room={room} />
            {finished ? (
                <Button onClick={handleFinish} colorScheme='teal' mt={4}>
                    座席配置を編集
                </Button>
            ) : (
                <Button onClick={handleFinish} colorScheme='teal' mt={4}>
                    座席配置を確定
                </Button>
            )}
        </Box>
    )
}
