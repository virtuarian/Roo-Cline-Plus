import { memo } from "react"
import { ModelInfo } from "../../../../src/shared/api"

interface ModelInfoViewProps {
	modelInfo: ModelInfo
}

export const ModelInfoView = memo(({ modelInfo }: ModelInfoViewProps) => {
	return (
		<div style={{ marginTop: 5, marginBottom: 5 }}>
			<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
				{modelInfo.supportsImages ? <span>Supports images</span> : <span>Does not support images</span>}
				{modelInfo.supportsComputerUse ? (
					<span>Supports computer use</span>
				) : (
					<span>Does not support computer use</span>
				)}
			</div>
		</div>
	)
})
