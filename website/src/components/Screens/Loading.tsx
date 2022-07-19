import type { NextPage } from 'next'
import Head from 'next/head'
import Mazeletter from '../../components/Misc/Mazeletter'
import style from './Loading.module.css'
import { Loading } from '@nextui-org/react'
import { useEffect, useState } from 'react'

type Props = {
	loadingUrl: string | null
}

const LoadingScreen: NextPage<Props> = ({ loadingUrl }) => {
	const [loadingMessage, setLoadingMessage] = useState(' ')
	const [dashboardMessageIndex, setDashboardMessageIndex] = useState(0)
	const dashboardMessages = ['Authenticating', 'Fetching your server', 'Looking for channels', 'Fetching roles', '*Hold music 🎵*', 'Waiting for Discord', 'Rate limits aren\'t fun', '... come on']

	const incrimentDashboardMessage = () => {
		setLoadingMessage(dashboardMessages[dashboardMessageIndex])

		if (dashboardMessageIndex + 1 >= dashboardMessages.length) {
			setDashboardMessageIndex(0)
		} else {
			setDashboardMessageIndex(dashboardMessageIndex + 1)
		}
	}

	useEffect(() => {
		if (!loadingUrl) {
			setDashboardMessageIndex(0)
			setLoadingMessage(' ')
			return
		}

		if (loadingUrl.split('/')[1] === 'dashboard') {
			if (loadingMessage === ' ')  incrimentDashboardMessage()
			setTimeout(incrimentDashboardMessage, 3000)
			return
		}

		setDashboardMessageIndex(0)
		setLoadingMessage(' ')
	}, [loadingUrl, dashboardMessageIndex])

	return (
		<div>
			<Head>
				<title>Loading | Poly</title>
			</Head>
			<Mazeletter/>
			<div className={style.heading}>
				<div>
					<div>
						<h2><b>Loading</b></h2>
						<Loading/>
					</div>
					<p>{loadingMessage}</p>
				</div>
			</div>
		</div>
	)
}

export default LoadingScreen