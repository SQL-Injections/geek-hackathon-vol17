import { Box } from '@chakra-ui/react'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData, Form } from '@remix-run/react'
import { useState } from 'react'
import { SeatArrangement } from '~/original-components'
import Seat from '~/original-components/Seat'
import styles from '~/styles/input_seats_amount.module.css'

export const meta: MetaFunction = () => {
    return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {
    //clientでやってほしいので
    const [seatsAmount, setSeatsAmount] = useState(1)
    const [isInputted, setIsInputted] = useState(false)
    const [height, setHeight] = useState<number>(0)
    const [width, setWidth] = useState<number>(0)
    const [errMsg, setErrMsg] = useState('')
    const [isConfirmed, setIsConfirmed] = useState(false)

    function clickedSeatsAmount() {
        // 一応確認
        console.log(isInputted)
        // 二つ目のコンテナを表示する
        setIsInputted(true)
        //いい感じにheightとwidthの初期値を決定する
        const sqrt = Math.sqrt(seatsAmount)
        //整数に
        setHeight(Math.floor(sqrt) + 1)
        setWidth(Math.floor(sqrt))
    }

    function clickedWHAmount() {
        // 一応確認
        console.log(isInputted)
        // 二つ目のコンテナを表示する
        setIsConfirmed(true)
    }

    function validateInputs() {
        if (height * width < seatsAmount) {
            setErrMsg(`入力された${height}×${width} = ${height * width}席では要求された${seatsAmount}席を満たしません。`)
            return false
        }
        setErrMsg('')
        return true
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // フォーム送信前にバリデーションを実行
        if (!validateInputs()) {
            event.preventDefault() // バリデーションに失敗した場合、送信をブロック
        }
        // 動的にURLを設定する
        const form = event.currentTarget
        form.action = `/set_seats_position?height=${height}&width=${width}&seats_amount=${seatsAmount}`
    }

    return (
        <>
            <div className={styles.seats_amount_container}>
                <div className={styles.seats_amount_text}>席数を入力してください</div>
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
                <br />
                <button type='submit' className={styles.seats_amount_button} disabled={isInputted} onClick={clickedSeatsAmount}>
                    確定
                </button>
            </div>
            {isInputted && (
                // <Form action='/set_seats_position' method='post' onSubmit={handleSubmit}>
                <div className={`${styles.wh_length_container} ${isInputted ? styles.wh_length_container_visible : ''}`}>
                    <div className={styles.seats_amount_text}>縦横幅を入力してください</div>
                    <div className={styles.wh_err_msg}>{errMsg}</div>
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
                    <button type='submit' className={styles.wh_length_button} disabled={isConfirmed} onClick={clickedWHAmount}>
                        確定
                    </button>
                </div>
                // </Form>
            )}
            <div className={styles.seats_container} style={{ display: isConfirmed ? 'block' : 'none' }}>
                <Box className={`mx-auto ${styles.seats_boxes}`}>
                    <SeatArrangement row={height} col={width} />
                </Box>
            </div>
        </>
    )
}
