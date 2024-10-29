import { json } from "@remix-run/node";
import { isToClassSeats, pushIdAndClass } from "./assets/class_dat"; // Assume these are your server-side utility functions
// Validate class
export async function loader({ request }: any) {
    const url = new URL(request.url);
    //　クラスID　String型にします
    const classId = String(url.searchParams.get("class_id"));
    console.log(classId);
    const isValid = await isToClassSeats(classId);
    return json({ isValid });
}

// Add Class
export async function action({ request }: any) {
    const formData = await request.json();
    console.log(formData);
    const classId = String(formData.classId);
    console.log(classId);
    const classInfo = JSON.parse(formData.classInfo);
    // console.log(classInfo[0]);
    await pushIdAndClass(classId, classInfo);
    return json({ success: true });
}