import { Link } from '@remix-run/react'
import { Box, VStack } from '@chakra-ui/react'

export default function Index() {
    return (
        <Box display='flex' justifyContent='center' alignItems='center' height='100vh' bg='gray.100'>
            <VStack spaceY={8}>
                <Link to='/admin_login'>
                    <Box
                        display='inline-flex'
                        alignItems='center'
                        justifyContent='center'
                        px={6}
                        py={3}
                        borderRadius='md'
                        bg='blue.500'
                        color='white'
                        fontSize='lg'
                        fontWeight='bold'
                        _hover={{ bg: 'blue.600' }}
                        _active={{ bg: 'blue.700' }}
                        textAlign='center'
                    >
                        クラス管理者
                    </Box>
                </Link>
                <Link to='/login_students'>
                    <Box
                        display='inline-flex'
                        alignItems='center'
                        justifyContent='center'
                        px={6}
                        py={3}
                        borderRadius='md'
                        bg='teal.500'
                        color='white'
                        fontSize='lg'
                        fontWeight='bold'
                        _hover={{ bg: 'teal.600' }}
                        _active={{ bg: 'teal.700' }}
                        textAlign='center'
                    >
                        学生
                    </Box>
                </Link>
            </VStack>
        </Box>
    )
}
