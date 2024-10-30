import { json } from "@remix-run/node";
import { isValidUsr, pushUsr, addClass } from "./assets/admin_dat";

export async function loader({ request }: any) {
    const url = new URL(request.url);
    const usrId = url.searchParams.get("usr_id")?.toString();
    //いったんハッシュ化もソルトも存在しない状態で使うものとする
    const password = url.searchParams.get("password")?.toString();
    
    return json({item:false});

}

export async function action({ request }: any) {
    const formData = await request.formData();
    const usrId = formData.get("usr_id")?.toString();
    const classId = formData.get("class_id")?.toString();
    const password = formData.get("password")?.toString();
    const func = formData.get("function");

    if (func === "pushUsr") {
        return json({ pushUsr: await pushUsr(usrId, password) });
    }
    if (func === "addClass") {
        return json({ addClass: await addClass(usrId, password, classId) });
    }
    return json({ item: false });
}