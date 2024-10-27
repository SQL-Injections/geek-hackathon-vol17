import { json } from "@remix-run/node";
import { isValidUsr, pushUsr } from "../assets/student_dat";

export async function loader({ request }: any) {
    return json({ true: true });
    const url = new URL(request.url);
    const usrId = Number(url.searchParams.get("usr_id"));
    const classId = Number(url.searchParams.get("class_id"));

    const isValid = await isValidUsr(usrId, classId);
    return json({ isValid });
}

export async function action({ request }: any) {
    return json({ success: true });
    const formData = await request.formData();
    const usrId = Number(formData.get("usr_id"));
    const classId = Number(formData.get("class_id"));

    await pushUsr(usrId, classId);
}