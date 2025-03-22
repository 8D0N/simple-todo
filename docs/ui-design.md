# TODOアプリケーション UI設計書

## 1. コンポーネント階層

```mermaid
graph TD
    App[App Layout] --> Header[Header]
    App --> Main[Main Content]
    App --> Footer[Footer]
    
    Header --> Logo[Logo]
    Header --> Nav[Navigation]
    
    Main --> TaskList[Task List]
    Main --> TaskForm[Task Form]
    
    TaskList --> TaskItem[Task Item]
    TaskItem --> TaskCheckbox[Checkbox]
    TaskItem --> TaskTitle[Title]
    TaskItem --> TaskDescription[Description]
    TaskItem --> TaskPriority[Priority Badge]
    TaskItem --> TaskActions[Action Buttons]
    
    TaskForm --> FormInput[Form Inputs]
    TaskForm --> SubmitButton[Submit Button]
```

## 2. ページ構成

### 2.1 メインページ（タスク一覧）

```mermaid
graph TD
    MainPage[メインページ] --> Header[ヘッダー]
    MainPage --> TaskFilters[フィルター/検索]
    MainPage --> TaskList[タスク一覧]
    MainPage --> AddTaskButton[タスク追加ボタン]
    
    TaskFilters --> SearchInput[検索バー]
    TaskFilters --> CategoryFilter[カテゴリフィルター]
    TaskFilters --> PriorityFilter[優先度フィルター]
    TaskFilters --> SortOptions[ソートオプション]
```

### 2.2 タスク作成/編集モーダル

```mermaid
graph TD
    Modal[モーダル] --> ModalHeader[ヘッダー]
    Modal --> Form[フォーム]
    Modal --> ModalFooter[フッター]
    
    Form --> TitleInput[タイトル入力]
    Form --> DescriptionInput[説明入力]
    Form --> PrioritySelect[優先度選択]
    Form --> CategorySelect[カテゴリ選択]
    Form --> DueDatePicker[期限選択]
    
    ModalFooter --> CancelButton[キャンセル]
    ModalFooter --> SaveButton[保存]
```

## 3. コンポーネント詳細

### 3.1 共通コンポーネント

#### ヘッダー

- アプリケーションロゴ
- ナビゲーションメニュー
- ユーザー設定（オプション）

#### タスクアイテム

- チェックボックス（完了状態）
- タイトル
- 説明文
- 優先度バッジ
- アクションボタン（編集/削除）
- カテゴリタグ（オプション）
- 期限表示（オプション）

#### フォーム要素

- テキスト入力
- テキストエリア
- セレクトボックス
- チェックボックス
- 日付選択
- カラーピッカー（カテゴリ用）

### 3.2 レイアウト

#### デスクトップ

- ヘッダー: 固定
- メインコンテンツ: 2カラムレイアウト
  - 左: フィルター/検索
  - 右: タスク一覧
- フッター: 固定

#### モバイル

- ヘッダー: 固定
- メインコンテンツ: 1カラムレイアウト
  - フィルター/検索: スライドアップメニュー
  - タスク一覧: フルスクリーン
- フッター: 固定

## 4. デザインシステム

### 4.1 カラーパレット

```mermaid
graph LR
    Primary[Primary: #3B82F6] --> Secondary[Secondary: #10B981]
    Secondary --> Accent[Accent: #F59E0B]
    Accent --> Background[Background: #F9FAFB]
    Background --> Text[Text: #111827]
```

### 4.2 タイポグラフィ

- 見出し: Inter
- 本文: Inter
- サイズ階層:
  - H1: 2rem
  - H2: 1.5rem
  - H3: 1.25rem
  - Body: 1rem
  - Small: 0.875rem

### 4.3 スペーシング

- 基本単位: 0.25rem
- コンポーネント間: 1rem
- セクション間: 2rem

## 5. インタラクション

### 5.1 アニメーション

- ページ遷移: フェード
- モーダル: スライドアップ
- リストアイテム: フェードイン
- ボタン: ホバーエフェクト

### 5.2 レスポンシブ動作

- ブレークポイント:
  - モバイル: < 640px
  - タブレット: 640px - 1024px
  - デスクトップ: > 1024px

## 6. アクセシビリティ

### 6.1 キーボード操作

- Tabキーによるフォーカス移動
- ショートカットキー
  - タスク追加: Ctrl/Cmd + N
  - 検索: Ctrl/Cmd + F
  - フィルター: Ctrl/Cmd + Shift + F

### 6.2 スクリーンリーダー対応

- ARIAラベル
- 適切な見出し階層
- フォーカス管理
- エラー状態の通知
