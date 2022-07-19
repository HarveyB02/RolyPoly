import type { GetServerSidePropsContext, NextPage } from 'next'
import DiscordMessage from '../components/Misc/DiscordMessage'
import { PartialGuild } from '../utils/types'
import { fetchMutualGuilds } from '../utils/api'
import MainTemplate from '../components/Layouts/MainLayout'
import NotFound from './404'

type Props = {
	guilds: PartialGuild[] | null
}

const Home: NextPage<Props> = ({ guilds }) => {
	if (!guilds) return <NotFound/>
	
	return (
		<MainTemplate title="Home | Poly" guilds={guilds}>
			<h1>Lorem ipsum dolor sit amet.</h1>
			{/*<h1>Automate your university community.</h1>*/}
			<DiscordMessage>
				<p>Mauris a euismod mi. Donec a quam at lectus ultricies ornare id quis</p>
				<p>Aliquam vitae ipsum ut erat</p>
				<p>Sed fermentum vel elit at pharetra</p>
				{/*
					<p>I'm Poly. A Discord bot designed to make your life easier</p>
					<p>I can automatically setup channels & roles for subjects in your study - no permission hassle</p>
					<p>I allow members to choose what notifications and content they'd like to see</p>
					<p>I dont use any commands, new members can pick up and go</p>
				*/}
			</DiscordMessage>
		</MainTemplate>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const guilds = await fetchMutualGuilds(ctx)
	
	return { props: { guilds } }
}

export default Home