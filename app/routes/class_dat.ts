import { json } from '@remix-run/node'
import {
    assignSeats,
    idToClassSeats,
    pushIdAndClass,
    modifyClass,
    toggleFinished,
    handleFinish,
    getClassById,
} from './assets/class_dat' // Assume these are your server-side utility functions
import { requireUserSession as requireStudentSession } from './assets/student_auth.server'
import { requireUserSession as requireAdminSession } from './assets/admin_auth.server'

// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const classId = url.searchParams.get('class_id')
    if (!classId) {
        return json({ isValid: false })
    }
    const cls = await getClassById(classId)
    if (!cls) {
        return json({ isValid: false })
    }
    const classUuid = cls.uuid
    const isValid = await idToClassSeats(classUuid)
    return isValid === undefined ? json({ isValid: false }) : json({ isValid: !!isValid })
}
// Add Class
export async function action({ request }: any) {
    const formData = await request.json()
    const classUuid = formData.classUuid
    // Todo : この辺りの処理はidとパスワードを求めるべき
    const func = String(formData.function)

    switch (func) {
        case 'modifyClass': {
            const query = await requireStudentSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            const x = Number(formData.x)
            const y = Number(formData.y)
            const user = formData.user
            return await modifyClass(classUuid, user, x, y)
        }
        case 'handleFinishedSeats': {
            const query = await requireAdminSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            return await handleFinish(classUuid)
        }
        case 'addClassInfo': {
            const query = await requireAdminSession(request)
            if (!query) {
                return json({ notFoundSession: false })
            }
            const classId = formData.classId
            const cls = await getClassById(classId)
            if (!cls) {
                return json({ notFoundClass: false })
            }
            const classUuid = cls.uuid
            const classInfo = JSON.parse(formData.classInfo)
            return await pushIdAndClass(classUuid, classInfo)
        }
        default:
            throw new Error('Invalid action type')
    }
}
