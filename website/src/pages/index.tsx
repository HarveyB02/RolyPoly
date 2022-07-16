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
			<h1>Lorem ipsum dolor sit amet.</h1>
			<DiscordMessage>
				Mauris a euismod mi. Donec a quam at lectus ultricies ornare id quis<br/>
				Aliquam vitae ipsum ut erat<br/>
				Sed fermentum vel elit at pharetra
			</DiscordMessage>
		</MainTemplate>
	)
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const guilds = await fetchMutualGuilds(ctx)
	
	return { props: { guilds } }
}

export default Home