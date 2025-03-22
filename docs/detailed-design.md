# TODOアプリケーション 詳細設計書

## 1. APIエンドポイント設計

APIエンドポイントの詳細な仕様は `docs/api-spec.yaml` に記載されています。
このファイルはOpenAPI 3.0.0形式で記述されており、Swagger UIなどのツールで可視化できます。

主なエンドポイントは以下の通りです：

- `/api/tasks` - タスクの一覧取得と作成
- `/api/tasks/{id}` - タスクの詳細取得、更新、削除
- `/api/categories` - カテゴリの一覧取得と作成

詳細な仕様については `docs/api-spec.yaml` を参照してください。

## 2. データベーススキーマ詳細設計

### 2.1 テーブル定義

#### tasks テーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|----------|----------|------|------------|------|
| id | SERIAL | NO | - | 主キー |
| title | VARCHAR(255) | NO | - | タスクのタイトル |
| description | TEXT | YES | NULL | タスクの説明 |
| completed | BOOLEAN | NO | false | 完了状態 |
| priority | VARCHAR(10) | YES | NULL | 優先度（HIGH/MEDIUM/LOW） |
| category_id | INTEGER | YES | NULL | カテゴリID（外部キー） |
| due_date | TIMESTAMP WITH TIME ZONE | YES | NULL | 期限 |
| created_at | TIMESTAMP WITH TIME ZONE | NO | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NO | CURRENT_TIMESTAMP | 更新日時 |

#### categories テーブル

| カラム名 | データ型 | NULL | デフォルト | 説明 |
|----------|----------|------|------------|------|
| id | SERIAL | NO | - | 主キー |
| name | VARCHAR(100) | NO | - | カテゴリ名 |
| color | VARCHAR(7) | NO | - | カラーコード |
| created_at | TIMESTAMP WITH TIME ZONE | NO | CURRENT_TIMESTAMP | 作成日時 |

### 2.2 インデックス定義

| テーブル | インデックス名 | カラム | タイプ | 説明 |
|----------|----------------|--------|--------|------|
| tasks | idx_tasks_category_id | category_id | BTREE | カテゴリ検索用 |
| tasks | idx_tasks_completed | completed | BTREE | 完了状態検索用 |
| tasks | idx_tasks_priority | priority | BTREE | 優先度検索用 |
| tasks | idx_tasks_due_date | due_date | BTREE | 期限検索用 |
| categories | idx_categories_name | name | BTREE | カテゴリ名検索用 |

## 3. エラーハンドリング詳細設計

### 3.1 エラーコード体系

| エラーコード | カテゴリ | 説明 | HTTPステータス |
|--------------|----------|------|----------------|
| 1000-1999 | システムエラー | サーバー内部エラー | 500 |
| 2000-2999 | 認証エラー | 認証・認可関連エラー | 401/403 |
| 3000-3999 | リソースエラー | リソース操作エラー | 404/400 |
| 4000-4999 | ビジネスロジックエラー | 業務ルール違反 | 400 |

### 3.2 エラーリカバリー戦略

| エラー種別 | リカバリー方法 | リトライ回数 | バックオフ時間 | フォールバック |
|------------|----------------|--------------|----------------|----------------|
| ネットワークエラー | 自動リトライ | 最大3回 | 指数関数的増加 | ローカルストレージ |
| バリデーションエラー | ユーザー入力修正 | - | - | - |
| 認証エラー | 再ログイン | - | - | - |
| データベースエラー | 自動リトライ | 最大3回 | 指数関数的増加 | キャッシュ |

### 3.3 エラーログ項目

| 項目 | 型 | 必須 | 説明 |
|------|-----|------|------|
| timestamp | string | 必須 | エラー発生時刻 |
| code | integer | 必須 | エラーコード |
| message | string | 必須 | エラーメッセージ |
| stack | string | 任意 | スタックトレース |
| requestId | string | 必須 | リクエストID |
| userId | string | 任意 | ユーザーID |
| details | object | 任意 | 詳細情報 |

## 1. システムアーキテクチャ

### 1.1 技術スタック

- フロントエンド: Next.js 14
- バックエンド: Next.js API Routes
- データベース: PostgreSQL
- ORM: Prisma
- 認証: NextAuth.js
- スタイリング: Tailwind CSS

### 1.2 セキュリティ対策

- 認証方式: JWT（JSON Web Token）
- パスワード: bcryptによるハッシュ化
- CSRF対策: Next.jsの組み込みCSRF保護
- XSS対策: Reactの自動エスケープ
- レート制限: APIルートごとの制限
- セキュアなセッション管理: HttpOnly Cookie
