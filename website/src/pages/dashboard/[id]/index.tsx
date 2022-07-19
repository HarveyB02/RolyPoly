import { GetServerSidePropsContext, NextPage } from 'next'
import { fetchGuild, fetchGuildChannels, fetchGuildRoles, fetchMutualGuilds } from '../../../utils/api'
import { Channels, Guild, PartialGuild, Roles } from '../../../utils/types'
import MainTemplate from '../../../components/Layouts/MainLayout'
import NotFound from '../../404'
import style from './index.module.css'
import { Collapse, Input, Spacer, Text } from '@nextui-org/react'
import GuildIcon from '../../../components/Images/GuildIcon'
import Select from 'react-select'
import { selectStyle, selectTheme } from '../../../utils/constants'

type Props = {
	guilds: PartialGuild[] | null,
	guild: Guild | null,
	roles: Roles | null,
	channels: Channels | null
}

const Dashboard: NextPage<Props> = ({ guilds, guild, roles, channels }) => {
	if (!guilds || !guild || !roles || !channels) return <NotFound
			customMessage={<><b>500</b> | An error has occured, please try again :&#40;</>}
			customTitle="500 - Error | Poly"
		/>

	const validRoles = roles.filter(role => role.id !== guild.id)
	const textChannels = channels.filter(channel => channel.type === 0)

	const roleOptions = validRoles.map((role) => ({
		label: `@${role.name}`,
		value: role.id
	}))

	const channelOptions = textChannels.map((channel) => ({
		label: `#${channel.name}`,
		value: channel.id
	}))

	return (
		<MainTemplate title={`Dashboard - ${guild.name} | Poly`} guilds={guilds}>	
			<div className={style.card}>
				<div className={style.title}>
					<GuildIcon
						showSkeleton
						width="45px"
						height="45px"
						guild={guild}
					/>
					<h2>{guild.name}</h2>
				</div>
				<div className="divider"></div>

				<Text size={18} weight="medium">Subject select channel</Text>
				<Select
					className="reactSelect"
					options={channelOptions}
					styles={selectStyle}
					theme={selectTheme}
				/>
				<Spacer y={0.75}/>

				<Text size={18} weight="medium">Mod alerts channel</Text>
				<Select
					className="reactSelect"
					options={channelOptions}
					styles={selectStyle}
					theme={selectTheme}
				/>
				<Spacer y={0.75}/>

				<Text size={18} weight="medium">Course roles</Text>
				<Select
					isMulti
					className="reactSelect"
					options={roleOptions}
					styles={selectStyle}
					theme={selectTheme}
				/>
				<Spacer y={0.75}/>

				<Text size={18} weight="medium">Subject redirects</Text>
				<Spacer y={0.75}/>

				<Collapse.Group className={style.advanced}>
					<Collapse title="Advanced">
						<div className="divider"></div>
						<Text size={18} weight="medium">Subject code validation regex</Text>
						<Input
							bordered
							labelLeft="/"
							placeholder="[a-z]*[0-9]*"
							labelRight="/i"
						/>
					</Collapse>
				</Collapse.Group>
			</div>
		</MainTemplate>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const guilds = await fetchMutualGuilds(ctx)
	const guild = await fetchGuild(ctx)
	const roles = await fetchGuildRoles(ctx)
	const channels = await fetchGuildChannels(ctx)
	
	return { props: { guilds, guild, roles, channels } }
}

export default Dashboard