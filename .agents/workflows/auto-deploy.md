---
description: 自動ビルド・コミット・プッシュを実行する
---
# 自動デプロイ手順

このプロジェクトでは、コードの変更後に常に以下の手順を自動実行してGitHub Pagesを更新します。

// turbo-all

1. 本番用ビルドの実行
```bash
npm run build
```

2. 変更のステージング
```bash
git add .
```

3. 変更内容をコミット (現状の作業に基づいた適切なコミットメッセージをAIが自動生成します)
```bash
git commit -m "chore: auto-update"
```

4. GitHubへプッシュし、Actionsによるデプロイをトリガーする
```bash
git push
```
