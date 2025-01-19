export const translations = {
	en: {
		settings: {
			language: "Language",
			apiProvider: "API Provider",
			model: "Model",
			baseUrl: "Base URL",
			apiKey: "API Key",
			useCustomBaseUrl: "Use custom base URL",
			optional: "optional",
			defaultText: "Default",
			languageModel: "Language Model",
			selectModel: "Select a model...",
			experimentalNote:
				"Note: This is a very experimental integration and may not work as expected. Please report any issues to the Roo-Cline GitHub repository.",
			localStorageNote: "This key is stored locally and only used to make API requests from this extension.",
			getApiKey: "You can get an API key by signing up here.",
			enableStreaming: "Enable streaming",
			supportsImages: "Supports images",
			doesNotSupportImages: "Does not support images",
			supportsComputerUse: "Supports computer use",
			doesNotSupportComputerUse: "Does not support computer use",
		},
	},
	ja: {
		settings: {
			language: "言語",
			apiProvider: "APIプロバイダー",
			model: "モデル",
			baseUrl: "ベースURL",
			apiKey: "APIキー",
			useCustomBaseUrl: "カスタムベースURLを使用",
			optional: "任意",
			defaultText: "デフォルト",
			languageModel: "言語モデル",
			selectModel: "モデルを選択...",
			experimentalNote:
				"注意：これは実験的な機能であり、期待通りに動作しない可能性があります。問題が発生した場合は、Roo-ClineのGitHubリポジトリに報告してください。",
			localStorageNote: "このキーはローカルに保存され、この拡張機能からのAPIリクエストにのみ使用されます。",
			getApiKey: "こちらでサインアップしてAPIキーを取得できます。",
			enableStreaming: "ストリーミングを有効化",
			supportsImages: "画像をサポート",
			doesNotSupportImages: "画像をサポートしていません",
			supportsComputerUse: "コンピュータ制御をサポート",
			doesNotSupportComputerUse: "コンピュータ制御をサポートしていません",
		},
	},
}

export type Language = "en" | "ja"
