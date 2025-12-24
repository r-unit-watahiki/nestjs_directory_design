# ディレクトリ構造

このドキュメントでは、本プロジェクトのディレクトリ構造とその設計思想について説明します。

## 設計方針

本プロジェクトは **モジュール別アーキテクチャ** を採用しています。機能ごとにモジュールを分割することで、以下のメリットがあります：

- **スケーラビリティ**: 新しい機能を追加する際、既存のコードに影響を与えにくい
- **保守性**: 機能ごとに独立しているため、特定の機能の修正が容易
- **チーム開発**: 複数の開発者が異なるモジュールを並行して開発可能
- **テスタビリティ**: 各モジュールを独立してテスト可能

## ディレクトリ構造

```
src/
├── main.ts                 # アプリケーションのエントリーポイント
├── app.module.ts           # ルートモジュール（全モジュールを統合）
├── app.controller.ts       # アプリケーションルートのコントローラー
├── app.service.ts          # アプリケーションルートのサービス
│
├── modules/                # 機能別モジュール
│   ├── users/              # ユーザー管理モジュール
│   ├── auth/               # 認証・認可モジュール
│   └── messages/           # メッセージ管理モジュール
│
├── common/                 # 共通機能（複数モジュールで使用）
│   ├── guards/             # 認証・認可ガード
│   ├── interceptors/       # リクエスト/レスポンスインターセプター
│   ├── filters/            # 例外フィルター
│   ├── decorators/         # カスタムデコレーター
│   └── utils/              # ユーティリティ関数
│
├── config/                 # アプリケーション設定
│   └── (データベース設定、環境変数設定など)
│
└── database/               # データベース関連
    ├── migrations/         # マイグレーションファイル
    └── seeds/              # シードデータ
```

## 各ディレクトリの詳細

### modules/ - 機能別モジュール

各モジュールは独立した機能を持ち、以下の構造を持ちます：

```
modules/
└── [module-name]/
    ├── [module-name].module.ts      # モジュール定義
    ├── [module-name].controller.ts  # HTTPリクエストハンドリング
    ├── [module-name].service.ts     # ビジネスロジック
    ├── [module-name].repository.ts  # データアクセス層
    ├── entities/                    # エンティティ（データモデル）
    │   └── [entity].entity.ts
    └── dto/                         # データ転送オブジェクト
        ├── create-[entity].dto.ts
        └── update-[entity].dto.ts
```

#### 各ファイルの役割

| ファイル               | 役割           | 責務                                               |
| ---------------------- | -------------- | -------------------------------------------------- |
| `*.module.ts`          | モジュール定義 | コントローラー、サービス、依存関係を宣言           |
| `*.controller.ts`      | コントローラー | HTTPリクエストを受け取り、適切なサービスを呼び出す |
| `*.service.ts`         | サービス       | ビジネスロジックを実装                             |
| `*.repository.ts`      | リポジトリ     | データベースアクセス、データ永続化を担当           |
| `entities/*.entity.ts` | エンティティ   | データモデル（データベーステーブルの定義）         |
| `dto/*.dto.ts`         | DTO            | APIリクエスト/レスポンスのデータ形式を定義         |

#### レイヤー構造

```
[HTTP Request]
      ↓
Controller  ← HTTPリクエスト受付、バリデーション
      ↓
Service     ← ビジネスロジック実装
      ↓
Repository  ← データアクセス、永続化
      ↓
[Database]
```

### 既存モジュールの説明

#### users/ - ユーザー管理モジュール

ユーザーのCRUD操作を提供します。

**エンドポイント:**

- `GET /users` - 全ユーザー一覧取得
- `GET /users/:id` - ユーザー詳細取得
- `POST /users` - 新規ユーザー作成
- `PATCH /users/:id` - ユーザー情報更新
- `DELETE /users/:id` - ユーザー削除

**エンティティ:**

- `User`: ユーザー情報（id, email, name, password, createdAt, updatedAt）

#### auth/ - 認証モジュール

ユーザー認証機能を提供します。

**エンドポイント:**

- `POST /auth/login` - ログイン
- `POST /auth/register` - ユーザー登録

**ディレクトリ構成:**

- `guards/`: 認証ガード（JWT認証など）を配置予定
- `strategies/`: Passport戦略（JWT Strategy, Local Strategyなど）を配置予定

#### messages/ - メッセージモジュール

メッセージのCRUD操作を提供します。

**エンドポイント:**

- `GET /messages` - 全メッセージ一覧取得
- `GET /messages/:id` - メッセージ詳細取得
- `POST /messages` - 新規メッセージ作成
- `PATCH /messages/:id` - メッセージ更新
- `DELETE /messages/:id` - メッセージ削除

**エンティティ:**

- `Message`: メッセージ情報（id, content, senderId, receiverId, createdAt, updatedAt）

### common/ - 共通機能

複数のモジュールで共通して使用する機能を配置します。

#### guards/

認証・認可ガードを配置します。

**使用例:**

- JwtAuthGuard: JWT認証
- RolesGuard: ロールベースのアクセス制御

#### interceptors/

リクエスト/レスポンスの変換やロギングなどを行うインターセプターを配置します。

**使用例:**

- LoggingInterceptor: ログ出力
- TransformInterceptor: レスポンスの整形
- TimeoutInterceptor: タイムアウト処理

#### filters/

例外ハンドリングを行うフィルターを配置します。

**使用例:**

- HttpExceptionFilter: HTTP例外のハンドリング
- AllExceptionsFilter: すべての例外をキャッチ

#### decorators/

カスタムデコレーターを配置します。

**使用例:**

- @CurrentUser(): リクエストからユーザー情報を取得
- @Roles(): ロール指定

#### utils/

汎用的なユーティリティ関数を配置します。

**使用例:**

- パスワードハッシュ化
- 日付フォーマット
- バリデーション関数

### config/ - 設定ファイル

アプリケーションの設定を管理します。

**配置するファイル例:**

- `database.config.ts`: データベース接続設定
- `jwt.config.ts`: JWT設定
- `app.config.ts`: アプリケーション全体の設定

### database/ - データベース関連

#### migrations/

データベーススキーマの変更履歴を管理するマイグレーションファイルを配置します。

#### seeds/

初期データやテストデータを投入するシードファイルを配置します。

## 新しいモジュールの追加方法

1. **モジュールディレクトリを作成**

```bash
mkdir -p src/modules/[module-name]/{entities,dto}
```

2. **必要なファイルを作成**

- `[module-name].module.ts`
- `[module-name].controller.ts`
- `[module-name].service.ts`
- `[module-name].repository.ts`
- `entities/[entity].entity.ts`
- `dto/create-[entity].dto.ts`
- `dto/update-[entity].dto.ts`

3. **app.module.tsにインポート**

```typescript
import { NewModule } from './modules/new/new.module';

@Module({
  imports: [UsersModule, AuthModule, MessagesModule, NewModule],
  // ...
})
```

## ベストプラクティス

### モジュールの独立性を保つ

- 各モジュールは可能な限り独立させる
- 他のモジュールに依存する場合は、`@Module`の`imports`で明示的に宣言
- 循環依存を避ける

### ファイル命名規則

- モジュール名は**複数形**を使用（users, messages）
- ファイル名は`[name].[type].ts`の形式（例: `users.controller.ts`）
- クラス名はPascalCase（例: `UsersController`）

### レイヤー分離

- Controller: HTTPリクエスト処理のみ
- Service: ビジネスロジックの実装
- Repository: データアクセスのみ

### DTOとEntityの分離

- **Entity**: データベースのテーブル構造を表現
- **DTO**: APIのリクエスト/レスポンス形式を定義
- セキュリティのため、Entityをそのまま返さない（パスワードなどの機密情報を含む可能性）

## 今後の拡張案

- **middleware/**: カスタムミドルウェアの追加
- **pipes/**: カスタムバリデーションパイプの追加
- **constants/**: 定数定義ファイルの追加
- **types/**: TypeScript型定義の追加
- **tests/**: 統合テストの追加

## 参考資料

- [NestJS公式ドキュメント](https://docs.nestjs.com)
- [NestJS モジュールシステム](https://docs.nestjs.com/modules)
