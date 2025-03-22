# シンプルTODOアプリケーション

## 概要

このアプリケーションは、シンプルで使いやすいTODOリスト管理ツールです。タスクの追加、完了、削除などの基本的な機能を提供します。

## 主な機能

- タスクの追加
- タスクの完了/未完了の切り替え
- タスクの削除
- タスクの一覧表示
- タスクの編集

## 技術スタック

- フロントエンド/バックエンド: Next.js 14
- データベース: PostgreSQL
- ORM: Prisma

## セットアップ方法

1. リポジトリのクローン

```bash
git clone [repository-url]
```

2. 依存パッケージのインストール

```bash
npm install
```

3. 環境変数の設定

```bash
cp .env.example .env.local
```

.env.localファイルに必要な環境変数を設定してください。

4. データベースのマイグレーション

```bash
npx prisma migrate dev
```

5. アプリケーションの起動

```bash
npm run dev
```

## 開発環境

- Node.js v18以上
- npm v8以上
- PostgreSQL v15以上

## ライセンス

MIT License
