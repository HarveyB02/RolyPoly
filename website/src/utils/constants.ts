import { StylesConfig, ThemeConfig } from 'react-select'

export const selectStyle: StylesConfig = {
	control: (provided, state) => {
		return {
			...provided,
			height: "40px",
			borderRadius: "var(--nextui-space-6)",
			borderColor: "var(--nextui-colors-gray300)",
			borderWidth: "2px"
		}
	}
}

export const selectTheme: ThemeConfig = (theme) => ({
	...theme,
	colors: {
		...theme.colors,
		primary: "var(--nextui-colors-red600)",
		primary75: "var(--nextui-colors-red500)",
		primary50: "var(--nextui-colors-red300)",
		primary25: "var(--nextui-colors-red200)",
	}
})