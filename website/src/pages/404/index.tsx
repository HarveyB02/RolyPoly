import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ReactElement } from 'react'
import Mazeletter from '../../components/Misc/Mazeletter'
import style from './index.module.css'

type Props = {
	customMessage?: string | ReactElement,
	customTitle?: string
}

const NotFound: NextPage<Props> = ({ customMessage, customTitle }) => {
	return (
		<div>
			<Head>
				<title>
					{customTitle ? customTitle
						: '404 - Page not Found | Poly'}
				</title>
			</Head>
			<Mazeletter/>
			<div className={style.heading}>
				<div>
					<h2>
						{customMessage ? customMessage
							: <><b>404</b> | This is not the page you are looking for.</>}
					</h2>
					<Link href="/">Take me home</Link>
				</div>
			</div>
		</div>
	)
}

export default NotFound