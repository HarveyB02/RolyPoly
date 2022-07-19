import { Button, Dropdown } from "@nextui-org/react"
import { useRouter } from "next/router"
import { Key } from "react"
import { PartialGuild } from "../../utils/types"

type GuildSelectProps = {
	guilds: PartialGuild[] | null
}

const GuildSelect = ({ guilds }: GuildSelectProps) => {
	const router = useRouter()
	
	const handleLogin = () => {
		router.push('http://localhost:3001/api/auth/discord')
	}

	const handleAction = (key: Key) => {
		if (key === 'logout') return
		if (key === 'noServers') return

		router.push(`/dashboard/${key}`)
	}

	const guildItems = () => {
		if (!guilds) return <></>

		const guildItems = guilds.map(guild => 
			<Dropdown.Item key={guild.id}>
				{guild.name}
			</Dropdown.Item>
		)

		if (guilds.length === 0) {
			guildItems.push(
				<Dropdown.Item key="noServers">
					No servers available
				</Dropdown.Item>
			)
		}

		guildItems.push(
			<Dropdown.Item key="logout" withDivider color="primary">
				Log out
			</Dropdown.Item>
		)
		
		return guildItems
	}

	return guilds ?
		<Dropdown>
			<Dropdown.Button>Servers</Dropdown.Button>
			<Dropdown.Menu
				onAction={handleAction}
				disabledKeys={["noServers"]}
			>{guildItems()}</Dropdown.Menu>
		</Dropdown>
	:
		<Button onClick={handleLogin}>Login with Discord</Button>
}

export default GuildSelect