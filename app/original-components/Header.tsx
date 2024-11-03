import { useNavigate } from '@remix-run/react'
import { Box, Flex, IconButton, Heading } from '@chakra-ui/react'
import { MdArrowBack } from 'react-icons/md'
import { FC, ReactNode } from 'react'

type HeaderProps = {
    children?: ReactNode
}

const Header: FC<HeaderProps> = ({ children }) => {
    const navigate = useNavigate()

    return (
        <Flex as='header' padding='1rem' backgroundColor='#f5f5f5' alignItems='center' justifyContent='space-between'>
            <IconButton onClick={() => navigate(-1)} aria-label='戻る' colorScheme='blue' variant='ghost'>
                <MdArrowBack />
            </IconButton>
            <Heading as='h1' size='lg' textAlign='center' flex='1'>
                どこでもシーター
            </Heading>
            <Box>{children}</Box>
        </Flex>
    )
}

export default Header
