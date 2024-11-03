import { Outlet } from '@remix-run/react'
import { AdminLogout } from '~/original-components'
import Header from '~/original-components/Header'

export default function HeaderCommon() {
    return (
        <>
            <Header>
                <AdminLogout />
            </Header>
            <Outlet />
        </>
    )
}
