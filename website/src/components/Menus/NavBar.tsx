import { useState } from 'react'
import style from './NavBar.module.css'
import { Button, Container, Link, Modal, Text } from '@nextui-org/react'
import { PartialGuild } from '../../utils/types'
import GuildSelect from '../Buttons/GuildSelect'
import Image from 'next/image'

type NavBarProps = {
	guilds: PartialGuild[] | null
}

const NavBar = ({ guilds }: NavBarProps) => {
	const [addModalOpen, setAddModelOpen] = useState(false)
	const [helpModalOpen, setHelpModelOpen] = useState(false)

	const openAddModal = () => setAddModelOpen(true)
	const closeAddModal = () => setAddModelOpen(false)
	const openHelpModal = () => setHelpModelOpen(true)
	const closeHelpModal = () => setHelpModelOpen(false)

	return (
		<div className={style.navbar}>
			<Container lg>
				<Link href="/">
					<div><Image alt="Logo" src="/favicon192.png" height="40px" width="40px" /></div>
					<span className={style.title}>Poly</span>
				</Link>
				<Link href="https://github.com/HarveyB02/Poly" color="text" className={style.link}>Github</Link>
				<Link onClick={openHelpModal} color="text" className={style.link}>Help</Link>
				<Link href="https://csitcommunity.com" color="text" className={style.link}>CSIT Community</Link>

				<div className={style.navDivider}></div>

				<Button color="secondary" onClick={openAddModal}>Invite</Button>
				<GuildSelect guilds={guilds}/>
			</Container>

			<Modal
				closeButton
				open={helpModalOpen}
				onClose={closeHelpModal}
			>
				<Modal.Header>
					<h2>Got questions? 🤔</h2>
				</Modal.Header>
				<Modal.Body className={style.modalBody}>
					<Text>Feel free to get in touch with any questions or concerns you may have <b>@Harvey#2222</b></Text>
				</Modal.Body>
			</Modal>

			<Modal
				closeButton
				open={addModalOpen}
				onClose={closeAddModal}
			>
				<Modal.Header>
					<h2>Get in touch! 📣</h2>
				</Modal.Header>
				<Modal.Body className={style.modalBody}>
					<Text>Unfortunately, Poly is currently a private bot.</Text>
					<Text>If you&apos;d like to see Poly in a community of your own, send me a message! <b>@Harvey#2222</b></Text>
				</Modal.Body>
			</Modal>
		</div>
	)
}

export default NavBar