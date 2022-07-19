import { Image } from "@nextui-org/react"
import { Guild } from "../../utils/types"
import style from './GuildIcon.module.css'

type Props = {
	guild: Guild,
	width: string,
	height: string
	showSkeleton: boolean
}

const GuildIcon = ({ guild, width, height, showSkeleton }: Props) => {
	if (!guild.icon) {
		let iconText = (guild.name.match(/(^.)| ./g) ?? []).join('').replace(' ', '')
		
		return (
			<div
				className={style.wrapper}
				style={{ width, height }}
			>
				<span>{iconText}</span>
			</div>
		)
	}

	const src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`

	return (
		<Image
			showSkeleton={showSkeleton}
			width={width}
			height={height}
			src={src}
		/>
	)
}

export default GuildIcon