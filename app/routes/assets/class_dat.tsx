import {
    getRoom,
    createRoom,
    updateRoom,
    getSeats,
    createSeats,
    updateSeats,
    updateSeatStudents,
    getClassById as getClass,
    isValidStudent,
    getStudentList,
} from '~/model'
import { Room, Student } from '~/model/model'
import { seatSize } from '~/config'

// クラスIDに基づいてRoomとその座席情報を取得
export async function idToClassSeats(classUuid: string): Promise<Room> {
    const dbRoom = await getRoom(classUuid)
    if (!dbRoom) throw new Error(`Room with classId ${classUuid} not found`)

    const dbSeats = await getSeats(dbRoom.uuid)
    return { ...dbRoom, seats: dbSeats }
}

// クラスIDと座席情報をDBに保存
export async function pushIdAndClass(classUuid: string, room: Room) {
    const createdRoom = await createRoom(classUuid, room)
    const roomUuid = createdRoom.uuid
    await createSeats(roomUuid, room.seats)
    return true
}

// 座席のデータを更新する
export async function modifyClass(classUuid: string, student: Student, x: number, y: number) {
    // ユーザーが無効であれば処理を終了する
    if (!(await isValidStudent(student.id, classUuid))) {
        return false
    }

    const room = await getRoom(classUuid)
    if (!room || room.finished) {
        return false
    }

    const seats = await getSeats(room.uuid)
    console.log('/assets/class_dat', seats)

    let seatPosition = { row: -1, column: -1 }

    seats.forEach((row, rowIndex) => {
        row.forEach((seat, columnIndex) => {
            if (seat.seatStudents.some((s) => s.uuid === student.uuid)) {
                seatPosition = { row: rowIndex, column: columnIndex }

                seat.seatStudents = seat.seatStudents.filter((s) => s.uuid !== student.uuid)
            }
        })
    })

    const targetSeat = seats[y][x]

    if (targetSeat.isAvailable) {
        targetSeat.seatStudents.push(student)

        if (!targetSeat.uuid) {
            return
        }

        await updateSeatStudents(targetSeat.uuid, targetSeat.seatStudents)

        if (seatPosition.row !== -1 && seatPosition.column !== -1) {
            const newPreSeat = seats[seatPosition.row][seatPosition.column]

            if (!newPreSeat.uuid) {
                return
            }
            await updateSeatStudents(newPreSeat.uuid, newPreSeat.seatStudents)
        }
    } else {
        throw new Error('This seat is not available for students')
    }

    return seats
}

export async function handleFinish(classUuid: string) {
    const { seat, finished } = await toggleFinished(classUuid)

    if (finished) {
        const newSeats = await assignSeats(classUuid)
        return { seat: newSeats, finished: finished }
    }
    return { seat: seat, finished: finished }
}

export async function toggleFinished(classUuid: string) {
    const room = await getRoom(classUuid)
    if (!room) {
        throw new Error(`Room with classId ${classUuid} not found`)
    }
    const seats = await getSeats(room.uuid)
    if (!seats) {
        throw new Error(`Seats with roomUuid ${room.uuid} not found`)
    }

    await updateRoom(classUuid, {
        ...{ uuid: room.uuid, row: room.row, column: room.column, seatAmount: room.seatAmount },
        seats: seats,
        finished: !room.finished,
    })

    return { seat: seats, finished: !room.finished }
}

export async function assignSeats(classUuid: string) {
    const roomData = await idToClassSeats(classUuid)
    const totalSeatAmount = roomData.seatAmount

    if (!roomData?.uuid) {
        throw new Error(`Room with classId ${classUuid} not found`)
    }

    console.log("totalSeatAmount:"+totalSeatAmount)

    const currentStudentList = roomData.seats.flatMap((seatRow) =>
        seatRow.flatMap((seat) => (seat.seatStudents.length > 0 ? seat.seatStudents : [])),
    )
    console.log("currentStudentList:"+currentStudentList)

    const emptySeatIndices = roomData.seats.flatMap((seatRow, rowIndex) =>
        seatRow.flatMap((seat, colIndex) => (seat.isAvailable ? [{ row: rowIndex, col: colIndex }] : [])),
    )
    console.log(emptySeatIndices)

    const unselectedStudents: Student[] = []

    // 現在の座席を更新し未選択の学生を収集
    const updatedSeats = roomData.seats.map((seatRow, rowIndex) =>
        seatRow.map((seat, colIndex) => {
            if (seat.seatStudents.length > 0) {
                const randomIndex = Math.floor(Math.random() * seat.seatStudents.length)
                const selectedStudent = seat.seatStudents[randomIndex]

                const remainingStudents = seat.seatStudents.filter((_, index) => index !== randomIndex)
                unselectedStudents.push(...remainingStudents)

                return { ...seat, seatStudents: [selectedStudent] }
            }
            return seat
        }),
    )
    console.log('未選択の学生リスト:', unselectedStudents)

    const shuffledEmptySeats = emptySeatIndices.sort(() => Math.random() - 0.5)
    const studentList = await getStudentList(classUuid)
    const missingStudents = studentList.filter(
        (student) => !currentStudentList.some((currentStudent) => currentStudent.id === student.id),
    )

    const unregisteredCount = totalSeatAmount - studentList.length
    const unregisteredStudents: Student[] = Array.from({ length: unregisteredCount }, (_, index) => ({
        id: `unregistered${index}`,
        displayName: String(index + 1),
    }))

    const studentsToAssign = [...unselectedStudents, ...unregisteredStudents, ...missingStudents]

    // 空席に学生をランダムに割り当てる
    shuffledEmptySeats.forEach(({ row, col }) => {
        if (studentsToAssign.length > 0) {
            const student = studentsToAssign.shift()
            if (student) {
                updatedSeats[row][col] = { ...updatedSeats[row][col], seatStudents: [student] }
            }
        }
    })
    console.log("ここまで４")

    await updateSeats(updatedSeats)
    console.log("ここまで２")
    return updatedSeats
}

export async function getClassById(classId: string) {
    return await getClass(classId)
}
