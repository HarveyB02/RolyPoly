import type { AppProps } from 'next/app'
import { createTheme, NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '../utils/styles/globals.css'

const theme = createTheme({
	type: 'light',
	theme: {
		colors: {
			red50: "#fff0f2",
			red100: "#ffe8eb",
			red200: "#fcd7dc",
			red300: "#fcc5cc",
			red400: "#faa7b2",
			red500: "#f78191",
			red600: "#f2112f",
			red700: "#b80920",
			red800: "#91091b",
			red900: "#4f040e",

			primaryLight: "$red200",
			primaryLightHover: "$red300",
			primaryLightActive: "$red400",
			primaryLightContrast: "$red600",
			primary: "$red600",
			primaryBorder: "$red500",
			primaryBorderHover: "$red600",
			primarySolidHover: "$red700",
			primarySolidContrast: "$white",
			primaryShadow: "$red500",
			secondaryLight: "$gray100",
			secondaryLightHover: "$gray200",
			secondaryLightActive: "$gray300",
			secondaryLightContrast: "$gray400",
			secondary: "$gray300",
			secondaryBorder: "$gray200",
			secondaryBorderHover: "$gray300",
			secondarySolidHover: "$gray500",
			secondarySolidContrast: "$gray900",
			secondaryShadow: "$gray200"
		},
		radii: {
			xs: "2px",
			sm: "4px",
			md: "7px",
			base: "9px",
			lg: "12px",
			xl: "14px",
			squared: "33%",
			rounded: "50%",
			pill: "9999px"
		}
	}
})

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<NextThemesProvider
			defaultTheme="light"
			attribute="class"
			value={{
				light: theme.className
			}}
		>
			<NextUIProvider>
				<Component {...pageProps} />
			</NextUIProvider>
		</NextThemesProvider>
	)
}

export default App
