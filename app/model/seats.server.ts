import { prisma } from './db.server'
import { Seat, Student } from './model'

export async function getSeats(roomUuid: string): Promise<Seat[][]> {
    const seats = await prisma.seat.findMany({
        where: { roomUuid: roomUuid },
        include: { students: true },
    })

    const maxRow = Math.max(...seats.map((seat) => seat.row))
    const maxColumn = Math.max(...seats.map((seat) => seat.column))

    const seatArray: Seat[][] = Array.from({ length: maxRow + 1 }, () =>
        Array.from({ length: maxColumn + 1 }, () => ({ isAvailable: false, seatStudents: [] })),
    )

    seats.forEach((seat) => {
        seatArray[seat.row][seat.column] = {
            uuid: seat.uuid,
            isAvailable: seat.isAvailable,
            seatStudents: seat.students,
        }
    })

    return seatArray
}

export async function createSeats(roomUuid: string, seats: Seat[][]) {
    console.log(roomUuid, seats)
    const createPromises = seats.flatMap((rowSeats, row) =>
        rowSeats.map((seat, column) =>
            prisma.seat.create({
                data: {
                    row: row,
                    column: column,
                    isAvailable: seat.isAvailable,
                    roomUuid: roomUuid,
                    students: {
                        connect: seat.seatStudents.map((student) => ({ uuid: student.uuid })),
                    },
                },
            }),
        ),
    )

    await Promise.all(createPromises)
}

export async function updateSeats(seats: Seat[][]) {
    const updatePromises = seats.flatMap((rowSeats, row) =>
        rowSeats.map((seat, column) =>
            prisma.seat.update({
                where: {
                    uuid: seat.uuid,
                },
                data: {
                    isAvailable: seat.isAvailable,
                    students: {
                        set: seat.seatStudents.map((student) => ({ uuid: student.uuid })),
                    },
                },
            }),
        ),
    )

    await Promise.all(updatePromises)
}

export async function updateSeatStudents(seatUuid: string, students: Student[]) {
    await prisma.seat.update({
        where: { uuid: seatUuid },
        data: {
            students: {
                set: students.map((student) => ({ uuid: student.uuid })),
            },
        },
    })
}
