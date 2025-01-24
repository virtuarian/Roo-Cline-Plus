import React, { createContext, useContext, useState } from "react"
import { Language, translations } from "../locales/translations"

interface LanguageContextType {
	language: Language
	setLanguage: (language: Language) => void
	t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [language, setLanguage] = useState<Language>("en")

	const t = (key: string): string => {
		const keys = key.split(".")
		let value: any = translations[language]

		for (const k of keys) {
			if (value === undefined) return key
			value = value[k]
		}

		return value || key
	}

	return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
	const context = useContext(LanguageContext)
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider")
	}
	return context
}
