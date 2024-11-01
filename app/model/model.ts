export type ClassList = {
    [managerId: string]: Array<Class>
}

export type SeatsInfo = {
    [classId: string]: Array<Array<Room>>
}

// 今後使うかも　使わなかったら消して
// export type RoomList = {
//     [classId: string]: Array<Room>
// }

// いるかわからん
export type ClassStudents = {
    [classId: string]: Array<Student>
}

export type Manager = {
    id: string
    password: string
}

export type Student = {
    id: string
    displayName: string
}

export type Class = {
    id: string
    name: string
}

export type Room = {
    row: number // 縦
    column: number // 横
    seatAmount: number
    seats: Array<Array<Seat>>
}

export type Seat = {
    isAvailable: boolean
    student?: Array<Student>
    isSelected?: boolean
}
