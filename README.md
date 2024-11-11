# どこでもシーター [geek-hackathon-vol17]

このリポジトリは、Geek Hackathon Vol.17 で使用される Remix アプリケーションです。

## プロジェクト概要

このアプリケーションは、教師や管理者がクラスの席替えを簡単に行えるように設計されています。主な機能は以下の通りです:

-   **クラス管理**: クラス情報を管理し、クラスごとに異なる席替えを設定可能。
-   **席替えシミュレーション**: 直感的な UI を使用して、席替えのシミュレーションを行い、最適な席配置を見つけることができます。
-   **学生情報管理**: 学生の名前や ID を管理し、クラスに所属させることで席替えをスムーズに実施。
-   **リアルタイム更新**: 席替えの結果を即座に反映し、管理者と学生の双方がリアルタイムで変更を確認可能。

## 環境セットアップ

### 必要なソフトウェア

このプロジェクトをローカル環境で動作させるために、以下のソフトウェアをインストールしてください。

-   [Node.js](https://nodejs.org/) (バージョン 16 以上)
-   [npm](https://www.npmjs.com/)
-   [SQLite](https://www.sqlite.org/)

### クローンとインストール

1. リポジトリをクローンします:

    ```bash
    git clone https://github.com/SQL-Injections/geek-hackathon-vol17.git
    cd geek-hackathon-vol17
    ```

2. 依存関係をインストールします:

    ```bash
    npm install
    ```

### 環境変数の設定

1. プロジェクトのルートディレクトリに `.env.develop` ファイルを作成します:

    ```bash
    touch .env
    ```

2. 以下の内容を `.env` に追加します:

    ```env
    # SQLiteを使用する場合
    DATABASE_URL="file:./dev.db"
    ```

## アプリケーションの起動

開発モードでアプリケーションを起動するには、以下のコマンドを実行します:

```bash
npm run dev
```

これで Remix の開発サーバーが起動します。

## Prisma のセットアップ

### マイグレーションの実行

データベーススキーマを設定するために、Prisma のマイグレーションを実行します:

```bash
npm run migrate:dev
npx prisma generate
```

### データの確認

Prisma Studio を使用してデータベースを確認することができます:

```bash
npx prisma studio
```

これにより、ブラウザで Prisma Studio が開き、データベースの内容を視覚的に管理できます。

## デプロイ

本番環境にデプロイする際は、ホスティングプロバイダーのガイドに従い、必要な環境変数を設定してください。

## スクリプト

-   `npm run dev`: 開発サーバーを起動します。
-   `npm run build`: 本番環境用にビルドします。
-   `npm start`: 本番サーバーを起動します。
-   `npm run migrate:dev`: Prisma のマイグレーションを実行します。
