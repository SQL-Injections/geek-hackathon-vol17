import { json, useLoaderData, Link } from '@remix-run/react'
import { useState } from 'react'
import { getClassList } from '../assets/admin_dat'
import { Box, Card, CardBody, Container, Heading, SimpleGrid } from '@chakra-ui/react'

export const loader = async () => {
    const classList = getClassList('admin')
    return json({ classes: classList })
}

// Todo 一覧画面でクラス名を編集 UI変更

export default function Index() {
    const { classes } = useLoaderData<typeof loader>()

    return (
        <Container maxW='container.xl' py={8}>
            <Box
                bg='blue.600'
                color='white'
                width='80vh'
                py={4}
                px={6}
                mx='auto'
                borderRadius='md'
                textAlign='center'
                mb={8}
                shadow='md'
            >
                クラス一覧
            </Box>
            <SimpleGrid columns={{ base: 3, md: 5 }} gridGap={4}>
                {classes.map((className: string, index: number) => (
                    // とりあえず、className
                    <Link to={`/input_seats_amount?${className}`} key={index} style={{ textDecoration: 'none' }}>
                        <Box
                            height='10vh'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            borderWidth='1px'
                            borderRadius='lg'
                            overflow='hidden'
                            p={4}
                            bg='blue.50'
                            _hover={{
                                bg: 'blue.100',
                                shadow: 'md',
                            }}
                            textAlign='center'
                        >
                            <Heading size='md' color='blue.800'>
                                {className}
                            </Heading>
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>
        </Container>
    )
}
