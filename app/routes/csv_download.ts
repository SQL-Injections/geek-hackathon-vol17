import { LoaderFunctionArgs } from '@remix-run/node'
import { getStudentList } from './assets/student_dat'
import { Student } from '~/model/model'

export async function action({ request }: LoaderFunctionArgs) {
    const formData = await request.formData()
    const classUuid = formData.get('class_uuid') as string
    if (classUuid) {
        const studentList = await getStudentList(classUuid)
        if (!studentList) {
            return false
        } else {
            // CSVデータを生成
            const csvContent = generateCsv(studentList)
            console.log(csvContent)
            return new Response(csvContent, {
                headers: {
                    'Content-Type': 'text/csv; charset=cp932',
                    'Content-Disposition': `attachment; filename="data.csv"`,
                },
            })
        }
    } else {
        return new Response('Invalid request', { status: 400 })
    }
}
// CSV生成関数
function generateCsv(data: Student[]) {
    const header = 'id\n' // 必要に応じてヘッダーを変更
    const rows = data.map((student) => `${student.id}`).join('\n')
    return header + rows
}
