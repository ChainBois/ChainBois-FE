'use client'

import s from '@/styles'
import { cf } from '@/utils'
import m from './ScrollMenu.module.css'

const MenuOption = ({ tag, action }) => {
	return (
		<button
			className={cf(s.flex, s.flexCenter, m.menuOption)}
			onClick={action}
		>
			{tag}
		</button>
	)
}

export default function ScrollMenu({options = []}) {
	return (
		<div className={cf(s.wMax, s.flex, m.parent)}>
			<div className={cf(s.wMax, s.flex, s.flexLeft, m.wrapper)}>
				<div className={cf(s.flex, s.flex_dColumn, m.menu)}>
					<MenuOption
						tag={'Home'}
						action={() => {}}
					/>
					<MenuOption
						tag={'Gameplay'}
						action={() => {}}
					/>
					<MenuOption
						tag={'Tournament'}
						action={() => {}}
					/>
					<MenuOption
						tag={'Roadmap'}
						action={() => {}}
					/>
					<MenuOption
						tag={'Team'}
						action={() => {}}
					/>
					<MenuOption
						tag={'Partnership'}
						action={() => {}}
					/>
				</div>
			</div>
		</div>
	)
}
