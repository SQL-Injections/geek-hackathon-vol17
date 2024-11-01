import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { isValidUsr } from "./admin_dat";
import { createUserSession } from "./admin_auth.server";


export async function login({
    usr_id,
    password
}: {
    usr_id: string;
    password: string;
}) {
    const existingUser = await isValidUsr(usr_id, password);
    if (!existingUser) {
        const error: any = new Error(
            "id又はpasswordに誤りがあります。"
        );
        error.status = 401;
        throw error;
    }

    return createUserSession(usr_id, "/management_classes");
}

