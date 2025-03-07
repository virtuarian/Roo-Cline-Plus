import {
	VSCodeButton,
	VSCodeCheckbox,
	VSCodeLink,
	VSCodeTextArea,
	VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react"
import { Dropdown } from "vscrui"
import type { DropdownOption } from "vscrui"
import { memo, useEffect, useState } from "react"
import { useExtensionState } from "../../context/ExtensionStateContext"
import { useLanguage } from "../../context/LanguageContext"
import { validateApiConfiguration, validateModelId } from "../../utils/validate"
import { vscode } from "../../utils/vscode"
import ApiOptions from "./ApiOptions"
import McpEnabledToggle from "../mcp/McpEnabledToggle"
import ApiConfigManager from "./ApiConfigManager"
import { Mode } from "../../../../src/shared/modes"
import OpenRouterModelPicker, {
	ModelDescriptionMarkdown,
	OPENROUTER_MODEL_PICKER_Z_INDEX,
} from "./OpenRouterModelPicker"
const IS_DEV = false // FIXME: use flags when packaging

type SettingsViewProps = {
	onDone: () => void
}

const SettingsView = ({ onDone }: SettingsViewProps) => {
	const { language, setLanguage, t } = useLanguage()
	const {
		apiConfiguration,
		version,
		customInstructions,
		setCustomInstructions,
		alwaysAllowReadOnly,
		setAlwaysAllowReadOnly,
		alwaysAllowWrite,
		setAlwaysAllowWrite,
		alwaysAllowExecute,
		setAlwaysAllowExecute,
		alwaysAllowBrowser,
		setAlwaysAllowBrowser,
		alwaysAllowMcp,
		setAlwaysAllowMcp,
		soundEnabled,
		setSoundEnabled,
		soundVolume,
		setSoundVolume,
		diffEnabled,
		setDiffEnabled,
		browserViewportSize,
		setBrowserViewportSize,
		openRouterModels,
		glamaModels,
		setAllowedCommands,
		allowedCommands,
		fuzzyMatchThreshold,
		setFuzzyMatchThreshold,
		preferredLanguage,
		setPreferredLanguage,
		writeDelayMs,
		setWriteDelayMs,
		screenshotQuality,
		setScreenshotQuality,
		terminalOutputLineLimit,
		setTerminalOutputLineLimit,
		mcpEnabled,
		alwaysApproveResubmit,
		setAlwaysApproveResubmit,
		requestDelaySeconds,
		setRequestDelaySeconds,
		currentApiConfigName,
		listApiConfigMeta,
		mode,
		setMode,
		experimentalDiffStrategy,
		setExperimentalDiffStrategy,
	} = useExtensionState()
	const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(undefined)
	const [modelIdErrorMessage, setModelIdErrorMessage] = useState<string | undefined>(undefined)
	const [commandInput, setCommandInput] = useState("")

	const handleSubmit = () => {
		const apiValidationResult = validateApiConfiguration(apiConfiguration)
		const modelIdValidationResult = validateModelId(apiConfiguration, glamaModels, openRouterModels)

		setApiErrorMessage(apiValidationResult)
		setModelIdErrorMessage(modelIdValidationResult)
		if (!apiValidationResult && !modelIdValidationResult) {
			vscode.postMessage({
				type: "apiConfiguration",
				apiConfiguration,
			})
			vscode.postMessage({ type: "customInstructions", text: customInstructions })
			vscode.postMessage({ type: "alwaysAllowReadOnly", bool: alwaysAllowReadOnly })
			vscode.postMessage({ type: "alwaysAllowWrite", bool: alwaysAllowWrite })
			vscode.postMessage({ type: "alwaysAllowExecute", bool: alwaysAllowExecute })
			vscode.postMessage({ type: "alwaysAllowBrowser", bool: alwaysAllowBrowser })
			vscode.postMessage({ type: "alwaysAllowMcp", bool: alwaysAllowMcp })
			vscode.postMessage({ type: "allowedCommands", commands: allowedCommands ?? [] })
			vscode.postMessage({ type: "soundEnabled", bool: soundEnabled })
			vscode.postMessage({ type: "soundVolume", value: soundVolume })
			vscode.postMessage({ type: "diffEnabled", bool: diffEnabled })
			vscode.postMessage({ type: "browserViewportSize", text: browserViewportSize })
			vscode.postMessage({ type: "fuzzyMatchThreshold", value: fuzzyMatchThreshold ?? 1.0 })
			vscode.postMessage({ type: "preferredLanguage", text: preferredLanguage })
			vscode.postMessage({ type: "writeDelayMs", value: writeDelayMs })
			vscode.postMessage({ type: "screenshotQuality", value: screenshotQuality ?? 75 })
			vscode.postMessage({ type: "terminalOutputLineLimit", value: terminalOutputLineLimit ?? 500 })
			vscode.postMessage({ type: "mcpEnabled", bool: mcpEnabled })
			vscode.postMessage({ type: "alwaysApproveResubmit", bool: alwaysApproveResubmit })
			vscode.postMessage({ type: "requestDelaySeconds", value: requestDelaySeconds })
			vscode.postMessage({ type: "currentApiConfigName", text: currentApiConfigName })
			vscode.postMessage({
				type: "upsertApiConfiguration",
				text: currentApiConfigName,
				apiConfiguration,
			})
			vscode.postMessage({ type: "mode", text: mode })
			vscode.postMessage({ type: "experimentalDiffStrategy", bool: experimentalDiffStrategy })
			onDone()
		}
	}

	useEffect(() => {
		setApiErrorMessage(undefined)
		setModelIdErrorMessage(undefined)
	}, [apiConfiguration, language])

	// Initial validation on mount
	useEffect(() => {
		const apiValidationResult = validateApiConfiguration(apiConfiguration)
		const modelIdValidationResult = validateModelId(apiConfiguration, glamaModels, openRouterModels)
		setApiErrorMessage(apiValidationResult)
		setModelIdErrorMessage(modelIdValidationResult)
	}, [apiConfiguration, glamaModels, openRouterModels])

	const handleResetState = () => {
		vscode.postMessage({ type: "resetState" })
	}

	const handleAddCommand = () => {
		const currentCommands = allowedCommands ?? []
		if (commandInput && !currentCommands.includes(commandInput)) {
			const newCommands = [...currentCommands, commandInput]
			setAllowedCommands(newCommands)
			setCommandInput("")
			vscode.postMessage({
				type: "allowedCommands",
				commands: newCommands,
			})
		}
	}

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				padding: "10px 0px 0px 20px",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "17px",
					paddingRight: 17,
				}}>
				<h3 style={{ color: "var(--vscode-foreground)", margin: 0 }}>{t("settings.title")}</h3>
				<VSCodeButton onClick={handleSubmit}>{t("settings.done")}</VSCodeButton>
			</div>
			<div
				style={{ flexGrow: 1, overflowY: "scroll", paddingRight: 8, display: "flex", flexDirection: "column" }}>
				<div style={{ marginBottom: 5 }}>
					<h3 style={{ color: "var(--vscode-foreground)", margin: 0, marginBottom: 15 }}>
						{t("settings.providerSettings")}
					</h3>
					<ApiConfigManager
						currentApiConfigName={currentApiConfigName}
						listApiConfigMeta={listApiConfigMeta}
						onSelectConfig={(configName: string) => {
							vscode.postMessage({
								type: "loadApiConfiguration",
								text: configName,
							})
						}}
						onDeleteConfig={(configName: string) => {
							vscode.postMessage({
								type: "deleteApiConfiguration",
								text: configName,
							})
						}}
						onRenameConfig={(oldName: string, newName: string) => {
							vscode.postMessage({
								type: "renameApiConfiguration",
								values: { oldName, newName },
								apiConfiguration,
							})
						}}
						onUpsertConfig={(configName: string) => {
							vscode.postMessage({
								type: "upsertApiConfiguration",
								text: configName,
								apiConfiguration,
							})
						}}
					/>
					<ApiOptions apiErrorMessage={apiErrorMessage} modelIdErrorMessage={modelIdErrorMessage} />
				</div>

				<div style={{ marginBottom: 5 }}>
					<div style={{ marginBottom: 15 }}>
						<h3 style={{ color: "var(--vscode-foreground)", margin: 0, marginBottom: 15 }}>
							{t("settings.agentSettings")}
						</h3>

						<div style={{ marginBottom: 15 }}>
							<label style={{ fontWeight: "500", display: "block", marginBottom: 5 }}>
								{t("settings.agentMode")}
							</label>
							<select
								value={mode}
								onChange={(e) => {
									const value = e.target.value as Mode
									setMode(value)
									vscode.postMessage({ type: "mode", text: value })
								}}
								style={{
									width: "100%",
									padding: "4px 8px",
									backgroundColor: "var(--vscode-input-background)",
									color: "var(--vscode-input-foreground)",
									border: "1px solid var(--vscode-input-border)",
									borderRadius: "2px",
									height: "28px",
								}}>
								<option value="code">{t("settings.codeMode")}</option>
								<option value="architect">{t("settings.architectMode")}</option>
								<option value="ask">{t("settings.askMode")}</option>
							</select>
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.modeDescription")}
							</p>
						</div>

						<label style={{ fontWeight: "500", display: "block", marginBottom: 5 }}>
							{t("settings.preferredLanguage")}
						</label>
						<select
							value={preferredLanguage}
							onChange={(e) => setPreferredLanguage(e.target.value)}
							style={{
								width: "100%",
								padding: "4px 8px",
								backgroundColor: "var(--vscode-input-background)",
								color: "var(--vscode-input-foreground)",
								border: "1px solid var(--vscode-input-border)",
								borderRadius: "2px",
								height: "28px",
								zIndex: 100,
								position: "relative",
							}}>
							<option value="English">English</option>
							<option value="Arabic">Arabic - العربية</option>
							<option value="Brazilian Portuguese">Portuguese - Português (Brasil)</option>
							<option value="Czech">Czech - Čeština</option>
							<option value="French">French - Français</option>
							<option value="German">German - Deutsch</option>
							<option value="Hindi">Hindi - हिन्दी</option>
							<option value="Hungarian">Hungarian - Magyar</option>
							<option value="Italian">Italian - Italiano</option>
							<option value="Japanese">Japanese - 日本語</option>
							<option value="Korean">Korean - 한국어</option>
							<option value="Polish">Polish - Polski</option>
							<option value="Portuguese">Portuguese - Português (Portugal)</option>
							<option value="Russian">Russian - Русский</option>
							<option value="Simplified Chinese">Simplified Chinese - 简体中文</option>
							<option value="Spanish">Spanish - Español</option>
							<option value="Traditional Chinese">Traditional Chinese - 繁體中文</option>
							<option value="Turkish">Turkish - Türkçe</option>
						</select>
						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-descriptionForeground)",
							}}>
							{t("settings.languageDescription")}
						</p>
					</div>

					<div style={{ marginBottom: 15 }}>
						<span style={{ fontWeight: "500" }}>{t("settings.customInstructions")}</span>
						<VSCodeTextArea
							value={customInstructions ?? ""}
							style={{ width: "100%" }}
							rows={4}
							placeholder={t("settings.customInstructionsPlaceholder")}
							onInput={(e: any) => setCustomInstructions(e.target?.value ?? "")}
						/>
						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-descriptionForeground)",
							}}>
							{t("settings.customInstructionsDescription")}{" "}
							<span className="codicon codicon-notebook" style={{ fontSize: "10px" }}></span>{" "}
							{t("settings.customInstructionsPromptsNote")}
						</p>
					</div>

					<McpEnabledToggle />
				</div>

				<div style={{ marginBottom: 5 }}>
					<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
						<span style={{ fontWeight: "500", minWidth: "150px" }}>
							{t("settings.terminalOutputLimit")}
						</span>
						<input
							type="range"
							min="100"
							max="5000"
							step="100"
							value={terminalOutputLineLimit ?? 500}
							onChange={(e) => setTerminalOutputLineLimit(parseInt(e.target.value))}
							style={{
								flexGrow: 1,
								accentColor: "var(--vscode-button-background)",
								height: "2px",
							}}
						/>
						<span style={{ minWidth: "45px", textAlign: "left" }}>{terminalOutputLineLimit ?? 500}</span>
					</div>
					<p style={{ fontSize: "12px", marginTop: "5px", color: "var(--vscode-descriptionForeground)" }}>
						{t("settings.terminalOutputLimitDescription")}
					</p>
				</div>

				<div style={{ marginBottom: 5 }}>
					<VSCodeCheckbox
						checked={diffEnabled}
						onChange={(e: any) => {
							setDiffEnabled(e.target.checked)
							if (!e.target.checked) {
								// Reset experimental strategy when diffs are disabled
								setExperimentalDiffStrategy(false)
							}
						}}>
						<span style={{ fontWeight: "500" }}>{t("settings.enableDiffs")}</span>
					</VSCodeCheckbox>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						{t("settings.diffDescription")}
					</p>

					{diffEnabled && (
						<div style={{ marginTop: 10 }}>
							<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								<span style={{ color: "var(--vscode-errorForeground)" }}>⚠️</span>
								<VSCodeCheckbox
									checked={experimentalDiffStrategy}
									onChange={(e: any) => setExperimentalDiffStrategy(e.target.checked)}>
									<span style={{ fontWeight: "500" }}>{t("settings.experimentalDiffStrategy")}</span>
								</VSCodeCheckbox>
							</div>
							<p
								style={{
									fontSize: "12px",
									marginBottom: 15,
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.experimentalDiffStrategyDescription")}
							</p>

							<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								<span style={{ fontWeight: "500", minWidth: "100px" }}>
									{t("settings.matchPrecision")}
								</span>
								<input
									type="range"
									min="0.8"
									max="1"
									step="0.005"
									value={fuzzyMatchThreshold ?? 1.0}
									onChange={(e) => {
										setFuzzyMatchThreshold(parseFloat(e.target.value))
									}}
									style={{
										flexGrow: 1,
										accentColor: "var(--vscode-button-background)",
										height: "2px",
									}}
								/>
								<span style={{ minWidth: "35px", textAlign: "left" }}>
									{Math.round((fuzzyMatchThreshold || 1) * 100)}%
								</span>
							</div>
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.matchPrecisionDescription")}
							</p>
						</div>
					)}
				</div>

				<div style={{ marginBottom: 5 }}>
					<VSCodeCheckbox
						checked={alwaysAllowReadOnly}
						onChange={(e: any) => setAlwaysAllowReadOnly(e.target.checked)}>
						<span style={{ fontWeight: "500" }}>{t("settings.alwaysApproveReadOnly")}</span>
					</VSCodeCheckbox>
					<p
						style={{
							fontSize: "12px",
							marginTop: "5px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						{t("settings.alwaysApproveReadOnlyDescription")}
					</p>
				</div>

				<div
					style={{
						marginBottom: 15,
						border: "2px solid var(--vscode-errorForeground)",
						borderRadius: "4px",
						padding: "10px",
					}}>
					<h4 style={{ fontWeight: 500, margin: "0 0 10px 0", color: "var(--vscode-errorForeground)" }}>
						⚠️ {t("settings.highRiskSettings")}
					</h4>
					<p style={{ fontSize: "12px", marginBottom: 15, color: "var(--vscode-descriptionForeground)" }}>
						{t("settings.highRiskSettingsDescription")}
					</p>

					<div style={{ marginBottom: 5 }}>
						<VSCodeCheckbox
							checked={alwaysAllowWrite}
							onChange={(e: any) => setAlwaysAllowWrite(e.target.checked)}>
							<span style={{ fontWeight: "500" }}>{t("settings.alwaysApproveWrite")}</span>
						</VSCodeCheckbox>
						<p style={{ fontSize: "12px", marginTop: "5px", color: "var(--vscode-descriptionForeground)" }}>
							{t("settings.alwaysApproveWriteDescription")}
						</p>
						{alwaysAllowWrite && (
							<div style={{ marginTop: 10 }}>
								<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
									<input
										type="range"
										min="0"
										max="5000"
										step="100"
										value={writeDelayMs}
										onChange={(e) => setWriteDelayMs(parseInt(e.target.value))}
										style={{
											flex: 1,
											accentColor: "var(--vscode-button-background)",
											height: "2px",
										}}
									/>
									<span style={{ minWidth: "45px", textAlign: "left" }}>{writeDelayMs}ms</span>
								</div>
								<p
									style={{
										fontSize: "12px",
										marginTop: "5px",
										color: "var(--vscode-descriptionForeground)",
									}}>
									{t("settings.writeDelayDescription")}
								</p>
							</div>
						)}
					</div>

					<div style={{ marginBottom: 5 }}>
						<VSCodeCheckbox
							checked={alwaysAllowBrowser}
							onChange={(e: any) => setAlwaysAllowBrowser(e.target.checked)}>
							<span style={{ fontWeight: "500" }}>{t("settings.alwaysApproveBrowser")}</span>
						</VSCodeCheckbox>
						<p style={{ fontSize: "12px", marginTop: "5px", color: "var(--vscode-descriptionForeground)" }}>
							{t("settings.alwaysApproveBrowserDescription")}
							<br />
							{t("settings.browserSupportNote")}
						</p>
					</div>

					<div style={{ marginBottom: 5 }}>
						<VSCodeCheckbox
							checked={alwaysApproveResubmit}
							onChange={(e: any) => setAlwaysApproveResubmit(e.target.checked)}>
							<span style={{ fontWeight: "500" }}>{t("settings.alwaysApproveResubmit")}</span>
						</VSCodeCheckbox>
						<p style={{ fontSize: "12px", marginTop: "5px", color: "var(--vscode-descriptionForeground)" }}>
							{t("settings.alwaysApproveResubmitDescription")}
						</p>
						{alwaysApproveResubmit && (
							<div style={{ marginTop: 10 }}>
								<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
									<input
										type="range"
										min="0"
										max="100"
										step="1"
										value={requestDelaySeconds}
										onChange={(e) => setRequestDelaySeconds(parseInt(e.target.value))}
										style={{
											flex: 1,
											accentColor: "var(--vscode-button-background)",
											height: "2px",
										}}
									/>
									<span style={{ minWidth: "45px", textAlign: "left" }}>{requestDelaySeconds}s</span>
								</div>
								<p
									style={{
										fontSize: "12px",
										marginTop: "5px",
										color: "var(--vscode-descriptionForeground)",
									}}>
									{t("settings.requestDelayDescription")}
								</p>
							</div>
						)}
					</div>

					<div style={{ marginBottom: 5 }}>
						<VSCodeCheckbox
							checked={alwaysAllowMcp}
							onChange={(e: any) => setAlwaysAllowMcp(e.target.checked)}>
							<span style={{ fontWeight: "500" }}>{t("settings.alwaysApproveMcp")}</span>
						</VSCodeCheckbox>
						<p style={{ fontSize: "12px", marginTop: "5px", color: "var(--vscode-descriptionForeground)" }}>
							{t("settings.alwaysApproveMcpDescription")}
						</p>
					</div>

					<div style={{ marginBottom: 5 }}>
						<VSCodeCheckbox
							checked={alwaysAllowExecute}
							onChange={(e: any) => setAlwaysAllowExecute(e.target.checked)}>
							<span style={{ fontWeight: "500" }}>{t("settings.alwaysApproveExecute")}</span>
						</VSCodeCheckbox>
						<p style={{ fontSize: "12px", marginTop: "5px", color: "var(--vscode-descriptionForeground)" }}>
							{t("settings.alwaysApproveExecuteDescription")}
						</p>

						{alwaysAllowExecute && (
							<div style={{ marginTop: 10 }}>
								<span style={{ fontWeight: "500" }}>{t("settings.allowedAutoExecuteCommands")}</span>
								<p
									style={{
										fontSize: "12px",
										marginTop: "5px",
										color: "var(--vscode-descriptionForeground)",
									}}>
									{t("settings.allowedAutoExecuteCommandsDescription")}
								</p>

								<div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
									<VSCodeTextField
										value={commandInput}
										onInput={(e: any) => setCommandInput(e.target.value)}
										onKeyDown={(e: any) => {
											if (e.key === "Enter") {
												e.preventDefault()
												handleAddCommand()
											}
										}}
										placeholder={t("settings.commandPrefixPlaceholder")}
										style={{ flexGrow: 1 }}
									/>
									<VSCodeButton onClick={handleAddCommand}>{t("settings.add")}</VSCodeButton>
								</div>

								<div
									style={{
										marginTop: "10px",
										display: "flex",
										flexWrap: "wrap",
										gap: "5px",
									}}>
									{(allowedCommands ?? []).map((cmd, index) => (
										<div
											key={index}
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
												backgroundColor: "var(--vscode-button-secondaryBackground)",
												padding: "2px 6px",
												borderRadius: "4px",
												border: "1px solid var(--vscode-button-secondaryBorder)",
												height: "24px",
											}}>
											<span>{cmd}</span>
											<VSCodeButton
												appearance="icon"
												style={{
													padding: 0,
													margin: 0,
													height: "20px",
													width: "20px",
													minWidth: "20px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													color: "var(--vscode-button-foreground)",
												}}
												onClick={() => {
													const newCommands = (allowedCommands ?? []).filter(
														(_, i) => i !== index,
													)
													setAllowedCommands(newCommands)
													vscode.postMessage({
														type: "allowedCommands",
														commands: newCommands,
													})
												}}>
												<span className="codicon codicon-close" />
											</VSCodeButton>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div style={{ marginBottom: 5 }}>
					<div style={{ marginBottom: 10 }}>
						<div style={{ marginBottom: 15 }}>
							<h3 style={{ color: "var(--vscode-foreground)", margin: 0, marginBottom: 15 }}>
								{t("settings.browserSettings")}
							</h3>
							<label style={{ fontWeight: "500", display: "block", marginBottom: 5 }}>
								{t("settings.viewportSize")}
							</label>
							<select
								value={browserViewportSize}
								onChange={(e) => setBrowserViewportSize(e.target.value)}
								style={{
									width: "100%",
									padding: "4px 8px",
									backgroundColor: "var(--vscode-input-background)",
									color: "var(--vscode-input-foreground)",
									border: "1px solid var(--vscode-input-border)",
									borderRadius: "2px",
									height: "28px",
								}}>
								<option value="1280x800">{t("settings.largeDesktop")} (1280x800)</option>
								<option value="900x600">{t("settings.smallDesktop")} (900x600)</option>
								<option value="768x1024">{t("settings.tablet")} (768x1024)</option>
								<option value="360x640">{t("settings.mobile")} (360x640)</option>
							</select>
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.viewportSizeDescription")}
							</p>
						</div>

						<div style={{ marginBottom: 15 }}>
							<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
								<span style={{ fontWeight: "500", minWidth: "100px" }}>
									{t("settings.screenshotQuality")}
								</span>
								<input
									type="range"
									min="1"
									max="100"
									step="1"
									value={screenshotQuality ?? 75}
									onChange={(e) => setScreenshotQuality(parseInt(e.target.value))}
									style={{
										flexGrow: 1,
										accentColor: "var(--vscode-button-background)",
										height: "2px",
									}}
								/>
								<span style={{ minWidth: "35px", textAlign: "left" }}>{screenshotQuality ?? 75}%</span>
							</div>
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.screenshotQualityDescription")}
							</p>
						</div>
					</div>

					<div style={{ marginBottom: 5 }}>
						<div style={{ marginBottom: 10 }}>
							<h3 style={{ color: "var(--vscode-foreground)", margin: 0, marginBottom: 15 }}>
								{t("settings.notificationSettings")}
							</h3>
							<VSCodeCheckbox
								checked={soundEnabled}
								onChange={(e: any) => setSoundEnabled(e.target.checked)}>
								<span style={{ fontWeight: "500" }}>{t("settings.enableSoundEffects")}</span>
							</VSCodeCheckbox>
							<p
								style={{
									fontSize: "12px",
									marginTop: "5px",
									color: "var(--vscode-descriptionForeground)",
								}}>
								{t("settings.soundEffectsDescription")}
							</p>
						</div>
						{soundEnabled && (
							<div style={{ marginLeft: 0 }}>
								<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
									<span style={{ fontWeight: "500", minWidth: "100px" }}>{t("settings.volume")}</span>
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={soundVolume ?? 0.5}
										onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
										style={{
											flexGrow: 1,
											accentColor: "var(--vscode-button-background)",
											height: "2px",
										}}
										aria-label="Volume"
									/>
									<span style={{ minWidth: "35px", textAlign: "left" }}>
										{((soundVolume ?? 0.5) * 100).toFixed(0)}%
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				{IS_DEV && (
					<>
						<div style={{ marginTop: "10px", marginBottom: "4px" }}>{t("settings.debug")}</div>
						<VSCodeButton onClick={handleResetState} style={{ marginTop: "5px", width: "auto" }}>
							{t("settings.resetState")}
						</VSCodeButton>
						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-descriptionForeground)",
							}}>
							{t("settings.resetStateDescription")}
						</p>
					</>
				)}

				<div
					style={{
						textAlign: "center",
						color: "var(--vscode-descriptionForeground)",
						fontSize: "12px",
						lineHeight: "1.2",
						marginTop: "auto",
						padding: "10px 8px 15px 0px",
					}}>
					<p style={{ wordWrap: "break-word", margin: 0, padding: 0 }}>
						{t("settings.feedbackIntro")}{" "}
						<VSCodeLink href="https://github.com/virtuarian/Roo-Cline-Plus" style={{ display: "inline" }}>
							github.com/virtuarian/Roo-Cline-Plus
						</VSCodeLink>{" "}
					</p>
					<p style={{ fontStyle: "italic", margin: "10px 0 0 0", padding: 0 }}>
						{t("settings.version")}
						{version}
					</p>
				</div>
			</div>
		</div>
	)
}

export default memo(SettingsView)
