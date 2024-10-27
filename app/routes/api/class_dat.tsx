import { json } from "@remix-run/node";
import { isValidClass, pushIdAndClass } from "../assets/class_dat"; // Assume these are your server-side utility functions
// Validate user
export async function loader({ request }: any) {
    const url = new URL(request.url);
    const classId = Number(url.searchParams.get("class_id"));
    const usrId = Number(url.searchParams.get("usr_id"));
    const isValid = await isValidClass(classId);
    return json({ isValid });
}

// Add user
export async function action({ request }: any) {
    const formData = await request.formData();
    const usrId = Number(formData.get("usr_id"));
    const classId = Number(formData.get("class_id"));
    await pushIdAndClass(usrId, classId);
    return json({ success: true });
}