import { json } from '@remix-run/node'
import { pushUsr } from './assets/student_dat' // Assume these are your server-side utility functions
import { requireUserSession } from './assets/admin_auth.server'
import { getClassById } from './assets/class_dat'

// Validate class
export async function loader({ request }: any) {}

// Add Class
export async function action({ request }: any) {
    const query = await requireUserSession(request)
    if (!query) {
        return json({ notFoundSession: false })
    }
    const formData = await request.json()
    const classId = formData.classId
    const cls = await getClassById(classId)
    if (!cls) {
        return json({ notFoundClass: false })
    }
    // Todo : この辺りの処理はidとパスワードを求めるべき
    const users = JSON.parse(formData.student_ids)
    return await pushUsr(users, cls.uuid)
}
