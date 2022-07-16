import React from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { CssBaseline } from '@nextui-org/react'

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)
		return {
			...initialProps,
			styles: React.Children.toArray([initialProps.styles])
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta name="description" content="University Discord server management" />
					<link rel="apple-touch-icon" href="/favicon192.png" />
					<link rel="manifest" href="/manifest.json" />
					{CssBaseline.flush()}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument