# L-stepHP Landing Page

旅館・ホテル向けの Lステップ導入・運用支援サービスのLPテンプレートです。`index.html` をブラウザで開くだけで確認できます。

## カスタマイズ（最低限）

- 会社名: `index.html` 内の `YourCompany` を貴社名に置き換え
- お問い合わせ送信先: `index.html` 下部の `window.CONTACT_EMAIL` を受信メールに設定
- LINE友だち/問い合わせ: `index.html` の `YOUR_LINE_ID` を実IDに差し替え
- メタ情報: タイトル/ディスクリプション/OG画像（`assets/og-image.png` を差し替え）

## 構成

- `index.html`: ランディングページ本体（ヒーロー/サービス/理由/導入の流れ/料金/FAQ/お問い合わせ）
- `assets/css/styles.css`: スタイルシート（シンプルなレスポンシブ対応）
- `assets/js/main.js`: スムーススクロールと簡易 `mailto:` 送信
- `assets/img/`: 画像格納（ロゴやOG画像など）

## 使い方

1. このフォルダを開き、`index.html` をダブルクリックでブラウザ表示
2. まずは `CONTACT_EMAIL`、`YOUR_LINE_ID` を置き換え
3. 文言・色・ロゴを調整

## デプロイ候補

- GitHub Pages / Netlify / Vercel に静的ホスティング
- 独自ドメインを設定し、`<link rel="canonical">` と `og:url` を実URLに更新

## よくある拡張

- 予約カレンダーや日程調整の埋め込み
- お問い合わせのバックエンド（フォーム送信/API連携）
- 多言語切替、事例ページの追加、ブログ運用（SEO）

