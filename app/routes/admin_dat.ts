import { json } from "@remix-run/node";
import { isValidUsr, pushUsr, addClass } from "./assets/admin_dat";

export async function loader({ request }: any) {
    const url = new URL(request.url);
    console.log("url : ",url)
    const usrId = url.searchParams.get("usr_id")?.toString();
    console.log("usrId : ",usrId);
    //いったんハッシュ化もソルトも存在しない状態で使うものとする
    const password = url.searchParams.get("password")?.toString();
    console.log(password)
    
    return json({item: await isValidUsr(usrId,password)});

}

export async function action({ request }: any) {
    const formData = await request.formData();
    console.log(formData);
    const usrId = formData.get("usr_id")?.toString();
    const classId = formData.get("class_id")?.toString();
    const password = formData.get("password")?.toString();
    const func = formData.get("function");

    if (func === "pushUsr") {
        console.log("pusher")
        console.log(json({ pushUsr: await pushUsr(usrId, password) }));
        return json({ pushUsr: await pushUsr(usrId, password) });
    }
    if (func === "addClass") {
        console.log("addClass")
        return json({ addClass: await addClass(usrId, password, classId) });
    }
    return json({ item: false });
}