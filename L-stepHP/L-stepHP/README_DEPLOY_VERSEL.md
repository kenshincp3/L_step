# Vercel デプロイ（静的サイト）

このフォルダ一式を GitHub にアップ → Vercel で Import するだけで公開できます。

## 手順（GitHub 連携）

1. GitHub で新規リポジトリを作成
2. GitHub の「Add file」→「Upload files」で `Downloads/L-stepHP` の中身をまとめてアップ
3. Vercel で New Project → GitHub と連携 → 該当リポジトリを選択
4. 設定（すべて空でOK）
   - Framework Preset: Other
   - Build Command: （空）
   - Install Command: （空）
   - Output Directory: `.`（ルート）
5. Deploy を押す → `https://xxxx.vercel.app` が発行されます

## 公開後に差し替える箇所

- `index.html` のメタ
  - `og:url` と `<link rel="canonical">` を公開URLに更新
- `robots.txt` の `Sitemap:` を公開URLに更新
- `GTM-XXXXXXX` を使う場合は実IDに置換（使わない場合はそのままで動作に影響なし）

## 追加メモ

- `vercel.json` で基本ヘッダーとキャッシュを設定済み
- 独自ドメインは Vercel の “Domains” から追加 → DNS に CNAME を設定
- 更新は GitHub に push するだけで自動デプロイ

