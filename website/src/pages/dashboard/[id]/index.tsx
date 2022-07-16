import { GetServerSidePropsContext, NextPage } from 'next'
import { fetchGuild, fetchMutualGuilds } from '../../../utils/api'
import { Guild, PartialGuild } from '../../../utils/types'
import MainTemplate from '../../../components/Layouts/MainLayout'
import NotFound from '../../404'

type Props = {
	guilds: PartialGuild[] | null,
	guild: Guild | null
}

const Dashboard: NextPage<Props> = ({ guilds, guild }) => {
	if (!guild) return <NotFound/>

	return (
		<MainTemplate title={`Dashboard - ${guild.name} | Poly`} guilds={guilds}>
			<h1>Dashboard - {guild.name}</h1>
			<h2></h2>
			<ul>
				<li>Subjet channel</li>
				<li>Course roles</li>
				<li>Subject code regex</li>
				<li>Subject category regex</li>
				<li>Alert channel</li>
			</ul>
		</MainTemplate>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const guilds = await fetchMutualGuilds(ctx)
	const guild = await fetchGuild(ctx)
	
	return { props: { guilds, guild } }
}

export default Dashboard