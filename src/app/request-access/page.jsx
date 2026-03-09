'use client'

import { cf } from '@/utils'
import s from '@/styles'
import p from './page.module.css'
import AccountManagement from '@/components/AccountManagement';

export default function Page () {
    return (
        <div className={ cf(s.wMax, s.flex, s.flexTop, p.page) }>
            <AccountManagement />
        </div>
    )
}