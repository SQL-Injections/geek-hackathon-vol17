import { Form } from '@remix-run/react'
import { Button } from 'app/components/ui/button'

function LogoutButton() {
    const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!window.confirm('ログアウトしますか？')) {
            event.preventDefault()
        }
    }

    return (
        <Form method='post' action='/admin_logout'>
            <Button
                variant='solid'
                type='submit'
                p={2}
                bg={'red'}
                color={'white'}
                _hover={{ bg: 'green' }}
                onClick={handleLogout}
            >
                ログアウト
            </Button>
        </Form>
    )
}

export default LogoutButton
