import { Box } from '@chakra-ui/react'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData, Form, useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { SeatArrangement } from '~/original-components'
import { requireUserSession } from './assets/admin_auth.server'
import styles from '~/styles/input_seats_amount.module.css'
import { Seat as SeatType, Student } from '~/model/model'

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const data = await requireUserSession(request)
    const adminUuid = data.usrUuid
    return json({ adminUuid })
}

export default function Index() {
    const [seatsAmount, setSeatsAmount] = useState(48)
    // 初期値48に変更
    const [nowSeatsAmont,setNowSeatsAmont] = useState(0)
    const [className, setClassName] = useState('')
    const [isInputted, setIsInputted] = useState(false)
    const [height, setHeight] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)
    const [errMsg, setErrMsg] = useState('')
    const [classCreateError, setClassCreateError] = useState('')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [SeatsArray, setSeatsArray] = useState<Array<SeatType[]>>([])
    const [classId, setClassId] = useState<string>('')
    const fetcher = useFetcher()
    const admin = useLoaderData<typeof loader>()

    const createSeatArray = (row: number, column: number) => {
        return Array.from({ length: row }, () =>
            Array.from({ length: column }, () => {
                return { isAvailable: true, seatStudents: [] }
            }),
        )
    }

    useEffect(() => {
        setSeatsArray(createSeatArray(height, width))
    }, [height, width])

    function clickedSeatsAmount() {
        setIsInputted(true)
        const sqrt = Math.sqrt(seatsAmount)
        setHeight(Math.floor(sqrt))
        setWidth(Math.floor(sqrt)+3)
        //私のクラスに寄せます
    }

    function clickedWHAmount() {
        if (!validateInputs()) return
        setIsConfirmed(true)
    }

    function validateInputs() {
        if (height * width < seatsAmount) {
            setErrMsg(
                `入力された${height}×${width} = ${height * width}席では要求された${seatsAmount}席を満たしません。`,
            )
            return false
        }
        setNowSeatsAmont(height*width)
        setErrMsg('')
        return true
    }

    const handleValueChange = (newValue: Array<Array<SeatType>>) => {
        setSeatsArray(newValue)
    }

    async function createClass(event: React.FormEvent<HTMLFormElement>) {
        if (SeatsArray.flat().filter((seat) => seat.isAvailable).length !== seatsAmount) {
            console.log('現在選択中の席数は', SeatsArray.flat().filter((seat) => seat.isAvailable).length)
            setClassCreateError(
                `選択した席数${seatsAmount}に対して現在選択中の席数は${
                    SeatsArray.flat().filter((seat) => seat.isAvailable).length
                }個です。`,
            )
            event.preventDefault()
            return
        }
        const classId = String(Math.floor(Math.random() * 10000000))
        
        const roomDat = {
            row: height,
            column: width,
            seatAmount: seatsAmount,
            isFinished: false,
            seats: SeatsArray,
        }
        
        const student_ids: Student[] = []
        const id_set = [...Array(1000)].map((_, i) => i)
        for (let i = 0; i < seatsAmount; i++) {
            let rand = Math.floor(Math.random() * id_set.length)
            if (rand === id_set.length) rand = id_set.length - 1
            const value = id_set.splice(rand, 1)
            student_ids.push({ id: value.toString(), displayName: '' })
        }

        fetcher.submit(
            { admin_uuid: admin.adminUuid, class_id: classId, class_name: className,classInfo: JSON.stringify(roomDat), student_ids: JSON.stringify(student_ids)},
            { method: 'post', action: '/creat_class',encType: 'application/json' },
        )
    }

    const onClick = (rowCountIndex: number, columnIndex: number) => {
        setSeatsArray((prevSeats) =>
            prevSeats.map((row, rowIndex) =>
                row.map((seat, colIndex) =>
                    rowIndex === rowCountIndex && colIndex === columnIndex
                        ? { ...seat, isAvailable: !seat.isAvailable }
                        : seat,
                ),
            ),
        )
        setNowSeatsAmont(SeatsArray.flat().filter((seat) => seat.isAvailable).length -1)
    }

    const room = {
        row: height,
        column: width,
        seatAmount: seatsAmount,
        finished: false,
        seats: SeatsArray,
    }

    return (
        <>
            <div className={styles.seats_amount_container}>
                <div className={styles.seats_attribute}>
                    <div className={styles.seats_amount_text}>クラスの名前を入力してください</div>
                    <input
                        type='text'
                        name='class_name'
                        id='class_name'
                        placeholder='クラス名'
                        disabled={isInputted}
                        onChange={(e) => setClassName(String(e.target.value))}
                        className={styles.seats_amount_input}
                    />
                    <br />
                    <div className={styles.seats_amount_text}>クラスの人数を入力してください</div>
                    <input
                        type='number'
                        name='seats_amount'
                        id='seats_amount'
                        min='1'
                        defaultValue={seatsAmount}
                        disabled={isInputted}
                        onChange={(e) => setSeatsAmount(Number(e.target.value))}
                        className={styles.seats_amount_input}
                    />
                    <button
                        type='button'
                        className={styles.seats_amount_button}
                        disabled={isInputted}
                        onClick={clickedSeatsAmount}
                    >
                        確定
                    </button>
                </div>
            </div>
            {isInputted && (
                <div
                    className={`${styles.wh_length_container} ${isInputted ? styles.wh_length_container_visible : ''}`}
                >
                    <div className={styles.seats_amount_text}>縦横幅を入力してください</div>
                    <div className={styles.wh_length_text} style={{ top: '45%' }}>
                        縦
                    </div>
                    <input
                        type='number'
                        name='wh_length'
                        id='h_length'
                        min='1'
                        defaultValue={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className={styles.wh_length_input}
                        style={{ top: '45%' }}
                        disabled={isConfirmed}
                    />
                    <div className={styles.wh_length_text} style={{ top: '60%' }}>
                        横
                    </div>
                    <input
                        type='number'
                        name='wh_length'
                        id='w_length'
                        min='1'
                        defaultValue={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className={styles.wh_length_input}
                        style={{ top: '60%' }}
                        disabled={isConfirmed}
                    />
                    <button
                        type='button'
                        className={styles.wh_length_button}
                        disabled={isConfirmed}
                        onClick={clickedWHAmount}
                    >
                        確定
                    </button>
                    <div className={styles.wh_err_msg}>{errMsg}</div>
                </div>
            )}
            <div className={styles.seats_container} style={{ display: isConfirmed ? 'block' : 'none' }}>
                <div className={styles.seats_amount_text}>使用しない座席をクリックで選択してください</div>
                <div className={styles.kyotaku_space}>
                    <div className={styles.kyotaku}>教卓</div>
                    <div className={styles.now_seats}>
                        <div>現在選択中の座席数</div>
                        <div className={styles.num_seats}>
                            <div>{nowSeatsAmont}</div>
                            <div>/</div>
                            <div>{seatsAmount}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.seats}>
                    <Box className={`mx-auto ${styles.seats_boxes}`}>
                        <SeatArrangement room={room} onClick={onClick} />
                    </Box>
                </div>

                <Form action='/management_classes' method='get' onSubmit={createClass}>
                    <button type='submit' className={styles.seats_submit_button}>
                        クラスを生成する
                    </button>
                </Form>
                {classCreateError && (
                    <div className='relative w-full h-10 text-center text-red-500 font-bold text-base p-1 mb-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[calc(70%)]'>
                        {classCreateError}
                    </div>
                )}
            </div>
        </>
    )
}
