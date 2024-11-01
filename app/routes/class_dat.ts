import { json } from "@remix-run/node";
import { isToClassSeats, pushIdAndClass, modifyClass } from "./assets/class_dat"; // Assume these are your server-side utility functions
import { requireUserSession } from "./assets/student_auth.server";
// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url);
    //　クラスID　String型にします
    const classId = String(url.searchParams.get("class_id"));
    // console.log(classId);
    const isValid = await isToClassSeats(classId);
    return json({ isValid });
}


// Add Class
export async function action({ request }: any) {
    const query = await requireUserSession(request);
    if (!query){
        return json({ notFoundSession: false });
    }
    const formData = await request.json();
    // console.log(formData);
    const classId = String(formData.classId);
    // Todo : この辺りの処理はidとパスワードを求めるべき
    const func = String(formData.function);

    if (func === "modifyClass") {
        const x = Number(formData.x);
        const y = Number(formData.y);
        const usrName = String(formData.usrName);
        const usrId = String(formData.usrId);
        return await modifyClass(classId, usrId, usrName, x, y);
    }
    // console.log(classId);
    const classInfo = JSON.parse(formData.classInfo);
    // console.log(classInfo[0]);
    return await pushIdAndClass(classId, classInfo);
}
