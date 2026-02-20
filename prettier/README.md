# Prettier 整形ツール (prettier/)

Prettierを使用して、HTML, CSS, JavaScript, PHP のコードを読みやすい形式に自動フォーマットするブラウザ完結型のツールです。

## 機能

- **対応言語**:
  - HTML (`htmlmixed`)
  - CSS (`css`)
  - JavaScript (`javascript`)
  - PHP (`php`)
- **リアルタイム整形**: 左側の入力エリアに変更を加えるか、設定を変更した瞬間に自動で整形結果がプレビューされます（Debounce処理付き）。
- **PHPのタグ自動判定**: `<?php` が含まれていないPHPスニペットが入力された場合でも、内部的にタグを補完して正しくパースし、出力結果にも自動的に補完されたタグを付与します。
- **インデント切り替え**: 2スペース、4スペース、タブ幅から好みのインデントスタイルを選択できます。
- **ワンクリックコピー**: 整形後のコードをクリップボードにコピーできます。
- **ダークモード固定**: 開発作業に集中できるよう、目に優しいダークテーマのCodeMirrorエディタUIを採用しています。

## 使用技術

- [Prettier Standalone (v3.2.5)](https://prettier.io/docs/en/browser.html)
- [@prettier/plugin-php (v0.22.2)](https://github.com/prettier/plugin-php)
- CodeMirror 6 (各種言語Mode付き)
- Tailwind CSS v4

## ディレクトリ構造

- `index.html`: ツールのUI定義と、CDNからのPrettierコア/プラグイン読み込み
- `main.js`: CodeMirrorの初期化と、Prettierフォーマット処理の連携ロジック
