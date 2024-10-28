import { json } from "@remix-run/node";
import { isValidClass, pushIdAndClass } from "../assets/class_dat"; // Assume these are your server-side utility functions
// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url);
    //　クラスID　String型にします
    const classId = String(url.searchParams.get("class_id"));
    const isValid = await isValidClass(classId);
    return json({ isValid });
}

// Add Class
export async function action({ request }: any) {
    const formData = await request.formData();
    const classId = String(formData.get("class_id"));
    const classInfo = formData.get("classInfo");
    await pushIdAndClass(classId, classInfo);
    return json({ success: true });
}