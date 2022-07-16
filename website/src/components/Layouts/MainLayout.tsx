import { Container } from "@nextui-org/react"
import Head from "next/head"
import { ReactElement } from "react"
import { PartialGuild } from "../../utils/types"
import Mazeletter from "../Misc/Mazeletter"
import NavBar from "../Menus/NavBar"

type Props = {
	guilds: PartialGuild[] | null
	title: string
	children: ReactElement | ReactElement[]
}

const MainTemplate = ({ guilds, title, children }: Props) => {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
			<Mazeletter/>
			<NavBar guilds={guilds}/>
			<Container md className={"main fadeIn"}>
				<>{children}</>
			</Container>
		</>
	)
}

export default MainTemplate