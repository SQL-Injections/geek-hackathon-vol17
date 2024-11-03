import { ActionFunction } from '@remix-run/node'
import { logoutUser } from '~/routes/assets/admin_auth.server'

export const action: ActionFunction = async ({ request }) => {
    return logoutUser(request)
}
