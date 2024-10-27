import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import styles from "~/styles/login_students.module.css";
import { idToClassSeats, pushIdAndSeats} from "~/routes/assets/class_dat";
import { isValidUsr, pushUsr } from "./assets/student_dat";
import { useState, useEffect } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};



export default function Index() {
    const [usrId, setUsrId] = useState<number>();
    const [usrName, setUsrName] = useState("");
    const [classId, setClassId] = useState<number>();
    const [isInputted, setIsInputted] = useState(false);
    const fetcher = useFetcher();
    
    function clickedLogin() {
        // 一応確認
        console.log(isInputted);
        // 二つ目のコンテナを表示する
        if (idToClassSeats(classId)) {
            // もし、idが正しいなら
            // 二つ目のコンテナを表示する
            setIsInputted(true);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // すぐに送信せず待機

        // fetcherを使用してユーザーデータを確認
        await fetcher.submit(null, { method: "get", action: `/student_dat?usr_id=${usrId}&class_id=${classId}` });
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            console.log("Fetcher data:", fetcher.data);

            // バリデーションが成功した場合のみフォーム送信
            if (fetcher.data.isValid) {
                console.log("バリデーション成功: ユーザーが存在します");
                const form = document.querySelector("form") as HTMLFormElement;
                form.action = `/write_my_seats?class_id=${classId}&usr_id=${usrId}&usr_name=${usrName}`;
                form.submit(); // バリデーションに通った後で送信
            } else {
                console.log("バリデーション失敗: ユーザーが存在しません");
            }
        }
    }, [fetcher.data]);

    return(
        <>
            <div className={styles.container} style={{height: "250px"}}>
                <div className={styles.container_title}>class idを入力してください</div>
                <input type="password" name="password" placeholder="class id" onChange={(e) => setClassId(parseInt(e.target.value))} className={styles.userinput} disabled={isInputted} style={{top: "47%"}} />
                <button type="submit" className={styles.loginbutton} style={{top: "75%"}} disabled={isInputted} onClick={clickedLogin}>確認</button>
            </div>
            {isInputted && (
                <Form method="post" onSubmit={handleSubmit}>
                    <div className={`${styles.container_invisible}  ${isInputted ? styles.container_visible : ""}`} style={{height: "250px"}}>
                        <div className={styles.container_title}>user idとusernameを入力してください</div>
                        <input type="text" name="num" placeholder="id" defaultValue={usrId} onChange={(e) => setUsrId(parseInt(e.target.value))} className={styles.userinput} style={{left: "30%", width: "10%"}} />
                        <input type="text" name="username" placeholder="表示名" onChange={(e) => setUsrName(e.target.value)} className={styles.userinput} style={{left: "56%", width: "38%"}} />
                        <button type="submit" className={styles.loginbutton} style={{top: "75%"}}>ログイン</button>
                    </div>
                </Form>
                )
            }
        </>
    );
}