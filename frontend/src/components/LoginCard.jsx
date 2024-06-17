import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    Divider,
    AbsoluteCenter,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authScreenAtom } from '../atoms/authAtom';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();

    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error, 'error');
                return;
            }
            localStorage.setItem('user-threads', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast('Error', 'Internal server error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Box rounded={'lg'} boxShadow={'lg'} p={8} w={{ base: 'full', sm: '400px' }} bgColor={'gray.900'}>
                    <Stack spacing={4}>
                        <Heading fontSize={'4xl'} textAlign={'center'} color={'whitesmoke'}>
                            Log in
                        </Heading>
                        <FormControl isRequired>
                            <FormLabel color={'whitesmoke'}>Username</FormLabel>
                            <Input
                                type="text"
                                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                                value={inputs.username}
                                color={'whitesmoke'}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel color={'whitesmoke'}>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                                    value={inputs.password}
                                    color={'whitesmoke'}
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Logging in..."
                                size="lg"
                                color={'black'}
                                bg={'gray.300'}
                                _hover={{
                                    bg: 'gray.100',
                                }}
                                onClick={handleLogin}
                                isLoading={loading}
                            >
                                Log in
                            </Button>
                        </Stack>
                        <Stack pt={3} justify={'center'} align={'center'}>
                            <Text
                                color="gray.500"
                                _hover={{
                                    cursor: 'pointer',
                                    color: 'gray.300',
                                }}
                            >
                                <Link to={'/auth/forgot-password'}>Forgot password?</Link>
                            </Text>
                        </Stack>
                        <Box position="relative" p={3}>
                            <Divider />
                            <AbsoluteCenter bg="gray.900" px="4" color={'gray.500'}>
                                or
                            </AbsoluteCenter>
                        </Box>
                        <HStack justify={'center'} align={'center'}>
                            <Text align={'center'} color={'gray.500'}>
                                Don't have an account?{' '}
                            </Text>
                            <Text
                                _hover={{
                                    cursor: 'pointer',
                                    color: 'blue.300',
                                }}
                                color={'blue.400'}
                                onClick={() => setAuthScreen('signup')}
                            >
                                Sign up!
                            </Text>
                        </HStack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
