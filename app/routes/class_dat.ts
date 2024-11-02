import { json } from '@remix-run/node'
import { idToClassSeats, pushIdAndClass, modifyClass, toggleFinished } from './assets/class_dat' // Assume these are your server-side utility functions
import { requireUserSession } from './assets/student_auth.server'

// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url)
    //　クラスID　String型にします
    const classId = String(url.searchParams.get('class_id'))
    // console.log(classId);
    const isValid = await idToClassSeats(classId)
    return isValid === undefined ? false : isValid
}

// Add Class
export async function action({ request }: any) {
    const query = await requireUserSession(request)
    if (!query) {
        return json({ notFoundSession: false })
    }
    const formData = await request.json()
    // console.log(formData);
    const classId = String(formData.classId)
    // Todo : この辺りの処理はidとパスワードを求めるべき
    const func = String(formData.function)

    switch (func) {
        case 'modifyClass': {
            const x = Number(formData.x)
            const y = Number(formData.y)
            const usrName = formData.user.displayName
            const usrId = formData.user.id
            return await modifyClass(classId, usrId, usrName, x, y)
        }
        case 'toggleFinished': {
            toggleFinished(classId)

            return
        }
    }
    // console.log(classId);
    const classInfo = JSON.parse(formData.classInfo)
    // console.log(classInfo[0]);
    return await pushIdAndClass(classId, classInfo)
}
