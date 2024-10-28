import { json } from "@remix-run/node";
import { isValidUsr, pushUsr } from "./assets/student_dat";

export async function loader({ request }: any) {
    const url = new URL(request.url);
    const usrId = Number(url.searchParams.get("usr_id"));
    const classId = url.searchParams.get("class_id")?.toString();

    const isValid = await isValidUsr(usrId, classId);
    return json({ isValid });
}

export async function action({ request }: any) {
    const formData = await request.formData();
    const usrId = Number(formData.get("usr_id"));
    const classId = formData.get("class_id")?.toString();

    await pushUsr(usrId, classId);
}