import { json, useLoaderData, Link, useFetcher } from '@remix-run/react'
import { getClassList } from '../assets/admin_dat'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { Box, Card, CardBody, Container, Heading, SimpleGrid } from '@chakra-ui/react'
import { Button } from '../../components/ui/button'
import { Class } from '~/model/model'
import { requireUserSession } from '../assets/admin_auth.server'
import { useEffect } from 'react'
import { AdminLogout as Logout } from '~/original-components'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // sessionからデータを取り出す
    const data = await requireUserSession(request)
    const { usrId, classId, usrName } = data

    const classList = getClassList(usrId)
    const class_id = data.classId
    return json({ classes: classList })
}

export default function Index() {
    const fetcher = useFetcher()
    function DownloadCsv() {
        console.log('DownloadCsv')
        let classId = '1' //クラスID仮置き

        const formData = new FormData()
        formData.append('class_id', classId)
        console.log(formData)

        console.log('fetcher定義')
        fetcher.submit(formData, { method: 'post', action: '/csv_download' })
    }
    // Todo 一覧画面でクラス名を編集 UI変更
    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            console.log('Fetcher data:', fetcher.data)
            console.log(fetcher.data)
            // バリデーションが成功した場合のみフォーム送信
            if (fetcher.data) {
                console.log('成功しました．CSVファイルゲット')
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
    const { classes } = useLoaderData<typeof loader>()
    return (
        <>
            <Logout />
            <Container maxW='container.xl' py={8}>
                <Box
                    bg='blue.600'
                    color='white'
                    width='80vh'
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
                <SimpleGrid columns={{ base: 3, md: 5 }} gridGap={4}>
                    {classes.map((cls: Class, index: number) => (
                        // とりあえず、className
                        <Link to={`/teacher_manage_seats/${cls.id}`} key={index} style={{ textDecoration: 'none' }}>
                            <Box
                                height='10vh'
                                display='flex'
                                alignItems='center'
                                justifyContent='center'
                                borderWidth='1px'
                                borderRadius='lg'
                                overflow='hidden'
                                p={4}
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
                    ))}
                </SimpleGrid>
                <button onClick={DownloadCsv}>CSVダウンロード</button>

                <Button variant='surface'>
                    <a href={`/input_seats_amount`}>新規クラス追加</a>
                </Button>
            </Container>
        </>
    )
}
