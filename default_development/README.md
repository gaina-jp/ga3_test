# default_development

フロントエンド開発テンプレート（Pug + SCSS + TypeScript + Gulp + Vite）

## 必要環境

- Node.js v22（`.nvmrc` で指定済み）
- nvm

```bash
nvm use
```

## コマンド

作業ディレクトリは `libs/`

```bash
cd libs
npm install     # 初回のみ
npm run dev     # 開発サーバー起動（http://localhost:5474）
npm run build   # 本番ビルド（../htdocs へ出力）
npm run lint    # 型チェック + ESLint + Stylelint
npm run lint:fix  # 自動修正付き Lint
```

## 外出先・スマホからのアクセス（Cloudflare Tunnel）

### 事前インストール（初回のみ）

```bash
brew install cloudflare/cloudflare/cloudflared
```

### 使い方

```bash
# 1. 開発サーバー起動
npm run dev

# 2. 別ターミナルでトンネル起動
cloudflared tunnel --url http://localhost:5474
```

ターミナルに表示された `https://xxxx.trycloudflare.com` をブラウザやスマホで開く。
`Ctrl+C` でトンネルを終了するとURLは即座に無効になる。

> アカウント不要の一時トンネル。URLは起動のたびに変わる。
> クライアントへの共有にも使えるが、URLを知っていれば誰でもアクセス可能な点に注意。

### Option B: 名前付きトンネル（永続URL・認証付き）※未設定

Cloudflareアカウント＋ドメイン（Cloudflare DNS管理）が必要。費用は無料（ドメイン取得費を除く）。

#### セットアップ手順

```bash
# 1. Cloudflareにログイン
cloudflared tunnel login

# 2. トンネル作成
cloudflared tunnel create ga3-dev

# 3. 設定ファイル作成
#    ~/.cloudflared/config.yml
#
#    tunnel: <上記で発行されたUUID>
#    credentials-file: /Users/ga3/.cloudflared/<UUID>.json
#
#    ingress:
#      - hostname: dev.yourdomain.com
#        service: http://localhost:5474
#      - service: http_status:404

# 4. DNSレコード追加
cloudflared tunnel route dns ga3-dev dev.yourdomain.com

# 5. 起動
cloudflared tunnel run ga3-dev
```

#### Cloudflare Access で認証を追加（推奨）

Cloudflareダッシュボード → Zero Trust → Access → Applications で設定。
メールOTPを使うとクライアントはアカウント不要で、メールアドレスに届くワンタイムPINで認証できる。

1. Application を作成（対象: `dev.yourdomain.com`）
2. Policy でアクセス許可するメールアドレスを指定
3. 確認が終わったらそのメールをポリシーから削除して無効化

## ディレクトリ構成

```
default_development/
├── libs/          # 作業ディレクトリ（ソース・設定）
│   └── src/       # 編集対象（Pug / SCSS / TypeScript）
└── htdocs/        # ビルド成果物（直接編集しない）
```
