import { Checkbox, Dropdown } from "vscrui"
import type { DropdownOption } from "vscrui"
import { VSCodeLink, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from "react"
import { useEvent, useInterval } from "react-use"
import {
	ApiConfiguration,
	ModelInfo,
	anthropicDefaultModelId,
	anthropicModels,
	azureOpenAiDefaultApiVersion,
	bedrockDefaultModelId,
	bedrockModels,
	deepSeekDefaultModelId,
	deepSeekModels,
	geminiDefaultModelId,
	geminiModels,
	glamaDefaultModelId,
	glamaDefaultModelInfo,
	mistralDefaultModelId,
	mistralModels,
	openAiModelInfoSaneDefaults,
	openAiNativeDefaultModelId,
	openAiNativeModels,
	openRouterDefaultModelId,
	openRouterDefaultModelInfo,
	vertexDefaultModelId,
	vertexModels,
} from "../../../../src/shared/api"
import { ExtensionMessage } from "../../../../src/shared/ExtensionMessage"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useLanguage } from "../../context/LanguageContext"
import { vscode } from "../../utils/vscode"
import * as vscodemodels from "vscode"
import VSCodeButtonLink from "../common/VSCodeButtonLink"
import OpenRouterModelPicker, {
	ModelDescriptionMarkdown,
	OPENROUTER_MODEL_PICKER_Z_INDEX,
} from "./OpenRouterModelPicker"
import OpenAiModelPicker from "./OpenAiModelPicker"
import GlamaModelPicker from "./GlamaModelPicker"

interface ApiOptionsProps {
	apiErrorMessage?: string
	modelIdErrorMessage?: string
}

const ApiOptions = ({ apiErrorMessage, modelIdErrorMessage }: ApiOptionsProps) => {
	const { apiConfiguration, setApiConfiguration, uriScheme, onUpdateApiConfig } = useExtensionState()
	const { language, setLanguage, t } = useLanguage()
	const [ollamaModels, setOllamaModels] = useState<string[]>([])
	const [lmStudioModels, setLmStudioModels] = useState<string[]>([])
	const [vsCodeLmModels, setVsCodeLmModels] = useState<vscodemodels.LanguageModelChatSelector[]>([])
	const [anthropicBaseUrlSelected, setAnthropicBaseUrlSelected] = useState(!!apiConfiguration?.anthropicBaseUrl)
	const [azureApiVersionSelected, setAzureApiVersionSelected] = useState(!!apiConfiguration?.azureApiVersion)
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

	const handleInputChange = (field: keyof ApiConfiguration) => (event: any) => {
		const apiConfig = { ...apiConfiguration, [field]: event.target.value }
		onUpdateApiConfig(apiConfig)
		setApiConfiguration(apiConfig)
	}

	const { selectedProvider, selectedModelId, selectedModelInfo } = useMemo(() => {
		return normalizeApiConfiguration(apiConfiguration)
	}, [apiConfiguration])

	// ... (既存のコードをここに挿入)

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
			{/* 言語選択ドロップダウンを追加 */}
			<div className="dropdown-container">
				<label htmlFor="language-selector">
					<span style={{ fontWeight: 500 }}>{t("settings.language")}</span>
				</label>
				<Dropdown
					id="language-selector"
					value={language}
					onChange={(value: unknown) => {
						setLanguage((value as DropdownOption).value as "en" | "ja")
					}}
					style={{ minWidth: 130 }}
					options={[
						{ value: "en", label: "English" },
						{ value: "ja", label: "日本語" },
					]}
				/>
			</div>

			<div className="dropdown-container">
				<label htmlFor="api-provider">
					<span style={{ fontWeight: 500 }}>{t("settings.apiProvider")}</span>
				</label>
				<Dropdown
					id="api-provider"
					value={selectedProvider}
					onChange={(value: unknown) => {
						handleInputChange("apiProvider")({
							target: {
								value: (value as DropdownOption).value,
							},
						})
					}}
					style={{ minWidth: 130, position: "relative", zIndex: OPENROUTER_MODEL_PICKER_Z_INDEX + 1 }}
					options={[
						{ value: "openrouter", label: "OpenRouter" },
						{ value: "anthropic", label: "Anthropic" },
						{ value: "gemini", label: "Google Gemini" },
						{ value: "deepseek", label: "DeepSeek" },
						{ value: "openai-native", label: "OpenAI" },
						{ value: "openai", label: "OpenAI Compatible" },
						{ value: "vertex", label: "GCP Vertex AI" },
						{ value: "bedrock", label: "AWS Bedrock" },
						{ value: "glama", label: "Glama" },
						{ value: "vscode-lm", label: "VS Code LM API" },
						{ value: "mistral", label: "Mistral" },
						{ value: "lmstudio", label: "LM Studio" },
						{ value: "ollama", label: "Ollama" },
					]}
				/>
			</div>

			{/* VS Code LM API のセクション */}
			{selectedProvider === "vscode-lm" && (
				<div>
					<div className="dropdown-container">
						<label htmlFor="vscode-lm-model">
							<span style={{ fontWeight: 500 }}>{t("settings.languageModel")}</span>
						</label>
						{vsCodeLmModels.length > 0 ? (
							<Dropdown
								id="vscode-lm-model"
								value={
									apiConfiguration?.vsCodeLmModelSelector
										? `${apiConfiguration.vsCodeLmModelSelector.vendor ?? ""}/${apiConfiguration.vsCodeLmModelSelector.family ?? ""}`
										: ""
								}
								onChange={(value: unknown) => {
									const valueStr = (value as DropdownOption)?.value
									if (!valueStr) {
										return
									}
									const [vendor, family] = valueStr.split("/")
									handleInputChange("vsCodeLmModelSelector")({
										target: {
											value: { vendor, family },
										},
									})
								}}
								style={{ width: "100%" }}
								options={[
									{ value: "", label: t("settings.selectModel") },
									...vsCodeLmModels.map((model) => ({
										value: `${model.vendor}/${model.family}`,
										label: `${model.vendor} - ${model.family}`,
									})),
								]}
							/>
						) : (
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.experimentalNote")}
							</p>
						)}
					</div>
				</div>
			)}

			{/* 残りのコンポーネントの内容... */}
			{/* ... */}
		</div>
	)
}

export function normalizeApiConfiguration(apiConfiguration?: ApiConfiguration) {
	const provider = apiConfiguration?.apiProvider || "anthropic"
	const modelId = apiConfiguration?.apiModelId

	const getProviderData = (models: Record<string, ModelInfo>, defaultId: string) => {
		let selectedModelId: string
		let selectedModelInfo: ModelInfo
		if (modelId && modelId in models) {
			selectedModelId = modelId
			selectedModelInfo = models[modelId]
		} else {
			selectedModelId = defaultId
			selectedModelInfo = models[defaultId]
		}
		return { selectedProvider: provider, selectedModelId, selectedModelInfo }
	}

	switch (provider) {
		case "anthropic":
			return getProviderData(anthropicModels, anthropicDefaultModelId)
		// ... (残りのケース)
		default:
			return getProviderData(anthropicModels, anthropicDefaultModelId)
	}
}

export default memo(ApiOptions)
