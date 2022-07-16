import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Mazeletter from '../../components/Misc/Mazeletter'
import style from './index.module.css'

const NotFound: NextPage = () => {
	return (
		<div>
			<Head>
				<title>404 - Page not Found | Poly</title>
			</Head>
			<Mazeletter/>
			<div className={style.heading}>
				<div>
					<h2><b>404</b> | This is not the page you are looking for.</h2>
					<Link href="/">Take me home</Link>
				</div>
			</div>
		</div>
	)
}

export default NotFound