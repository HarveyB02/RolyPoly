import Image from "next/image"
import { ReactNode } from "react"
import style from './DiscordMessage.module.css'

interface DiscordMessage {
	children: ReactNode
}

const DiscordMessage = (props: DiscordMessage) => {
	function getTime() {
		let date = new Date()
		let hours = date.getHours()
		let minutes = date.getMinutes()
		let ampm = hours >= 12 ? 'PM' : 'AM'
		hours = hours % 12
		hours = hours ? hours : 12
		let minutesStr = minutes < 10 ? '0' + minutes : minutes
		return `${hours}:${minutesStr} ${ampm}`
	}

	return (
		<div className={style.wrapper}>
			<div style={{ position: "static" }}>
				<div className={style.imageWrapper}>
					<Image alt="Poly avatar" width="40px" height="40px" src="/PolyAvatar.webp"/>
				</div>
				<div className={style.username}>Poly</div>
				<div className={style.botTag}>BOT</div>
				<div className={style.timestamp}>Today at {getTime()}</div>
				<div className={style.content}>{props.children}</div>
			</div>
		</div>
	)
}

export default DiscordMessage