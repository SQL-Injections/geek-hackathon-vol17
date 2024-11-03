import { Outlet } from '@remix-run/react'
import Header from '~/original-components/Header'

export default function HeaderCommon() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
