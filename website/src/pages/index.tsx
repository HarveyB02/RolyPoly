import type { GetServerSidePropsContext, NextPage } from 'next'
import DiscordMessage from '../components/Misc/DiscordMessage'
import { PartialGuild } from '../utils/types'
import { fetchMutualGuilds } from '../utils/api'
import MainTemplate from '../components/Layouts/MainLayout'

type HomeProps = {
	guilds: PartialGuild[] | null
}

const Home: NextPage<HomeProps> = ({ guilds }) => {
	return (
		<MainTemplate title="Home | Poly" guilds={guilds}>
			<h1>Automate your university community.</h1>
			<DiscordMessage>
				<p>I'm Poly. A Discord bot designed to make your life easier</p>
				<p>I can automatically setup channels & roles for subjects in your study - no permission hassle</p>
				<p>I allow members to choose what notifications and content they'd like to see</p>
				<p>I dont use any commands, new members can pick up and go</p>
			</DiscordMessage>
		</MainTemplate>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const guilds = await fetchMutualGuilds(ctx)
	
	return { props: { guilds } }
}

export default Home