# Roo Cline+

Roo Cline+は、VSCode Language Model APIの統合と追加機能を備えた、Roo Clineの拡張版です。自律的なコーディングアシスタントとして、複雑なソフトウェア開発タスクを段階的に処理できます。

## 主な機能

- **VSCode Language Model API統合**: 最新の言語モデルをシームレスに利用
- **拡張されたツールセット**: カスタムMCPツールによる機能拡張
- **高度なコード分析**: AST解析と正規表現検索によるプロジェクト理解
- **安全な自動化**: ファイル変更とコマンド実行の承認フロー

## インストール

1. 依存関係をインストール:

    ```bash
    npm run install:all
    ```

2. VSIXファイルをビルド:

    ```bash
    npm run build
    ```

3. `bin/`ディレクトリに生成されたVSIXファイルをVSCodeにインストール

    ```bash
    code --install-extension bin/roo-cline-plus-1.0.0.vsix
    cursor --install-extension bin/roo-cline-plus-1.0.0.vsix
    ```

## 使用方法

1. タスクを入力し、Clineがコードを分析
2. ファイルの作成・編集、コマンド実行を承認
3. 結果を確認し、必要に応じてフィードバック

## 貢献方法

貢献に興味がある方は、以下の手順で始めてください：

1. [Issues](https://github.com/RooVetGit/Roo-Cline-Plus/issues)を確認
2. 機能リクエストを[Discussions](https://github.com/RooVetGit/Roo-Cline-Plus/discussions)に投稿
3. プルリクエストを作成

## ライセンス

[Apache 2.0 © 2025 Roo-Cline-Plus Inc.](./LICENSE)
