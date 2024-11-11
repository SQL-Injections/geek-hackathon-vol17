import { Room } from './model'
import { prisma } from './db.server'

export async function getRoom(classUuid: string) {
    return prisma.room.findFirst({
        where: { classUuid: classUuid },
    })
}

export async function createRoom(classUuid: string, room: Room) {
    return prisma.room.create({
        data: {
            row: room.row,
            column: room.column,
            seatAmount: room.seatAmount,
            finished: room.finished,
            classUuid: classUuid,
        },
    })
}

export async function updateRoom(classUuid: string, room: Room) {
    return prisma.room.updateMany({
        where: { classUuid: classUuid },
        data: {
            row: room.row,
            column: room.column,
            seatAmount: room.seatAmount,
            finished: room.finished,
        },
    })
}
