import { json, useLoaderData, Link, useFetcher } from '@remix-run/react'
import { getClassList } from '../assets/admin_dat'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Box, Flex, Container, Heading } from '@chakra-ui/react'
import { Button } from '../../components/ui/button'
import { Class } from '~/model/model'
import { requireUserSession } from '../assets/admin_auth.server'

import { useEffect } from 'react'

import styles from '../../styles/management_classes.module.css'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // sessionからデータを取り出す
    const data = await requireUserSession(request)

    const { usrUuid } = data

    const classList = await getClassList(usrUuid)
    return json({ classes: classList })
}

export default function Index() {
    const fetcher = useFetcher()

    const { classes } = useLoaderData<typeof loader>()

    function DownloadCsv(classUuid: string) {
        const formData = new FormData()
        formData.append('class_uuid', classUuid)
        console.log(formData)

        console.log('fetcher定義')
        fetcher.submit(formData, { method: 'post', action: '/csv_download' })
    }
    // Todo 一覧画面でクラス名を編集 UI変更
    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            console.log(fetcher.data)
            // バリデーションが成功した場合のみフォーム送信
            if (fetcher.data) {
                console.log('成功しました.CSVファイルゲット')

                // Blobを作成し、URLを生成
                const blob = new Blob([fetcher.data], { type: 'text/csv;charset=cp932;' })
                const url = URL.createObjectURL(blob)

                // 一時的なリンクを作成してクリック
                const a = document.createElement('a')
                a.href = url
                a.download = 'data.csv' // ダウンロードするファイル名
                document.body.appendChild(a)
                a.click()

                // リンクを削除
                document.body.removeChild(a)
                URL.revokeObjectURL(url) // メモリ解放
            } else {
                console.log('失敗')
            }
        }
    }, [fetcher.data])
    return (
        <>
            <Container maxW='container.xl' py={8}>
                <Box
                    bg='blue.600'
                    color='white'
                    py={4}
                    px={6}
                    mx='auto'
                    borderRadius='md'
                    textAlign='center'
                    mb={8}
                    shadow='md'
                >
                    クラス一覧
                </Box>
                <div className={styles.Class_list}>
                    {classes.map((cls: Class, index: number) => {
                        const classUuid = cls.uuid
                        if (!classUuid) {
                            return null
                        }
                        return (
                            // とりあえず、className
                            <>
                                <Flex
                                    minWidth={'200px'}
                                    height='10vh'
                                    justify='space-between'
                                    borderRadius='lg'
                                    overflow='hidden'
                                    bg='blue.50'
                                    m={'3px'}
                                >
                                    <Link
                                        to={`/teacher_manage_seats/${cls.id}`}
                                        key={index}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Box
                                            overflow='scroll'
                                            height={'100%'}
                                            width={'100%'}
                                            bg='blue.50'
                                            _hover={{
                                                bg: 'blue.100',
                                                shadow: 'md',
                                            }}
                                            textAlign='center'
                                        >
                                            <Heading size='md' color='blue.800'>
                                                {cls.name}
                                                <br />
                                                classId:{cls.id}
                                            </Heading>
                                        </Box>
                                    </Link>
                                    <Link to={`/show_class_id/${cls.id}`}>
                                        <div className={styles.classId_btn}>ClassIDを見る</div>
                                    </Link>
                                    <button className={styles.download_btn} onClick={() => DownloadCsv(classUuid)}>
                                        <span className={styles.dli_box_in}>
                                            <span></span>
                                        </span>
                                    </button>
                                </Flex>
                            </>
                        )
                    })}
                </div>

                <Button variant='surface'>
                    <a href={`/input_seats_amount`}>新規クラス</a>
                </Button>
            </Container>
        </>
    )
}
