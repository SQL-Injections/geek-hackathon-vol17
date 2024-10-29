import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import styles from "~/styles/login_students.module.css";
import { idToClassSeats, pushIdAndSeats} from "~/routes/assets/class_dat";
import { isValidUsr, pushUsr } from "./assets/student_dat";
import { useState } from "react";

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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // フォーム送信前にバリデーションを実行
        if (!isValidUsr(usrId, classId)) {
            event.preventDefault(); // バリデーションに失敗した場合、送信をブロック
        }
        // 動的にURLを設定する
        const form = event.currentTarget;
        form.action = `/write_my_seats?class_id=${classId}&usr_id=${usrId}&usr_name=${usrName}`;
    }
    return(
        <>
            <div className={styles.container} style={{height: "250px"}}>
                <div className={styles.container_title}>class idを入力してください</div>
                <input type="password" name="password" placeholder="class id" onChange={(e) => setClassId(parseInt(e.target.value))} className={styles.userinput} disabled={isInputted} style={{top: "47%"}} />
                <button type="submit" className={styles.loginbutton} style={{top: "75%"}} disabled={isInputted} onClick={clickedLogin}>確認</button>
            </div>
            {isInputted && (
                <Form action='/write_my_seats' method="post" onSubmit={handleSubmit}>
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