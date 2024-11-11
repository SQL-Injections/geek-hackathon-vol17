export type Manager = {
    uuid?: string
    id: string
    password: string
}

export type Student = {
    uuid?: string
    id: string
    displayName: string
}

export type Class = {
    uuid?: string
    id: string
    name: string
}

export type Room = {
    uuid?: string
    row: number // 縦
    column: number // 横
    seatAmount: number
    finished?: boolean
    seats: Array<Array<Seat>>
}

export type Seat = { uuid?: string; isAvailable: boolean; seatStudents: Array<Student> }
