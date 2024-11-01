//　管理者ログイン画面
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";

import styles from "~/styles/admin_login.module.css";

import { useState, useEffect, useId } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function Index() {
    const [usrId, setUsrId] = useState<string>();
    const [password, setPassword] = useState<string>();
    const fetcher = useFetcher();
    
    async function clickedLogin() {
        // fetcherを使用してユーザーデータを確認
        console.log("clickedLogin");
        await fetcher.load(`/admin_dat?usr_id=${usrId}&password=${password}`);
    }

    useEffect(() => {
        // fetcherのレスポンスをチェック
        if (fetcher.data) {
            let responce = fetcher.data;
            console.log("Fetcher data:", responce);

            // バリデーションが成功した場合のみフォーム送信
            if (responce != false) {
                console.log("バリデーション成功: ユーザーが存在します");
                // ここでページ遷移
                window.location.href = "/management_classes"

            } else {
                console.log("バリデーション失敗: ユーザーが存在しません");
                setIsVisible(true);
            }
        }
    }, [fetcher.data]);

    const [isVisible, setIsVisible] = useState(false);

    return(
        <>
            <div className={styles.container} style={{height: "250px"}}>
                <div className={styles.container_title}>管理者用idを入力してください</div>
                <input type="text" name="usr_id" placeholder="admin id" onChange={(e) => setUsrId((e.target.value).toString())} className={styles.userinput}/>
                <div className={styles.container_title}>パスワードを入力してください</div>
                <input type="password" name="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} className={styles.userinput}/>
                <div className={styles.flex_btn}>
                    <button type="button" className={styles.loginbutton} onClick={clickedLogin}>ログイン</button>
                    <button type="button" className={styles.loginbutton}><a href={`/admin_register`}>新規登録</a></button>
                </div>
            </div>
            
            {isVisible && <div className={styles.error_container}>
                <div>
                <p className={styles.error_mes}>管理者用idかパスワードが間違っています</p>
                </div>
            </div>}
        </>
    );
}