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
import { requireUserSession as requireAdminSession } from './assets/admin_auth.server'
import { Class } from '~/model/model'
import { pushUsr, addClass } from './assets/admin_dat'
import { pushUsr as pushStudent } from './assets/student_dat' // Assume these are your server-side utility functions

// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url)
}
// Add Class
export async function action({ request }: any) {
    console.log("create_class")
    const formData = await request.json()
    const adminUuid = formData.admin_uuid
    const classId = formData.class_id
    const newClass = {
        id: classId,
        name: formData.class_name,
    } as Class
    const cls = await addClass(adminUuid, newClass)

    if (cls) {
        const classUuid = cls.uuid
        const classInfo = JSON.parse(formData.classInfo)
        let room  = await pushIdAndClass(classUuid, classInfo)
        console.log("room : ",room)

        const users = JSON.parse(formData.student_ids)
        console.log("users(student_dat) :await pushStudent(users, classUuid) ",users)
        let students = pushStudent(users, classUuid) //学生を作成
        return true
    }
    
}
