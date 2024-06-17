import { HamburgerIcon } from '@chakra-ui/icons';
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { useLayoutEffect, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { LuLogOut, LuMessageCircle, LuSettings, LuUser } from 'react-icons/lu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useLogout from '../hooks/useLogout';
import SearchBar from './SearchBar';
import SearchResultList from './SearchResultList';
import Settings from './Settings';

const Header = () => {
    const { colorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');
    const user = useRecoilValue(userAtom);
    const logout = useLogout();
    const location = useLocation();

    const MenuItemHoverStyles = {
        _hover: {
            backgroundColor: colorMode === 'dark' ? 'gray.900' : 'gray.100',
        },
    };

    useLayoutEffect(() => {
        if (!reset) setReset(!reset);
    }, [location]);

    return (
        <Box
            position={'sticky'}
            top={0}
            pt={0.5}
            pb={0.5}
            zIndex={100}
            bgColor={useColorModeValue('gray.100', '#101010')}
        >
            <Flex
                justifyContent="center"
                ml={'auto'}
                mr={'auto'}
                maxW={{ base: '620px', md: '900px' }}
                mt={5}
                mb={5}
                gap={15}
            >
                {user && (
                    <Link as={RouterLink} to="/" mt={1}>
                        <AiFillHome size={26} />
                    </Link>
                )}

                {user && (
                    <Flex position="relative" w={'50%'}>
                        <SearchBar
                            w={'full'}
                            setUsers={setUsers}
                            setInput={setInput}
                            setLoading={setLoading}
                            reset={reset}
                            location={location}
                        />
                        {users && users.length >= 0 && input.length > 0 && (
                            <SearchResultList users={users} w={'full'} loading={loading} />
                        )}
                    </Flex>
                )}

                {user && (
                    <Menu>
                        <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="outline" />
                        <MenuList bg={colorMode === 'dark' ? 'black' : 'white'}>
                            <MenuItem
                                as={RouterLink}
                                to={`/${user.username}`}
                                bg={colorMode === 'dark' ? 'black' : 'white'}
                                _hover={MenuItemHoverStyles}
                            >
                                <LuUser size={26} />
                                <Text ml={2}>Profile</Text>
                            </MenuItem>
                            <MenuItem
                                as={RouterLink}
                                to={`/chat`}
                                bg={colorMode === 'dark' ? 'black' : 'white'}
                                _hover={MenuItemHoverStyles}
                            >
                                <LuMessageCircle size={26} />
                                <Text ml={2}>Chat</Text>
                            </MenuItem>
                            <MenuItem
                                bg={colorMode === 'dark' ? 'black' : 'white'}
                                _hover={MenuItemHoverStyles}
                                onClick={onOpen}
                            >
                                <LuSettings size={26} />
                                <Text ml={2}>Settings</Text>
                            </MenuItem>
                            <MenuItem
                                onClick={logout}
                                bg={colorMode === 'dark' ? 'black' : 'white'}
                                _hover={MenuItemHoverStyles}
                            >
                                <LuLogOut size={26} />
                                <Text ml={2}>Log out</Text>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                )}

                <Drawer placement={'left'} size={'xs'} onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent bgColor={colorMode === 'dark' ? 'gray.dark' : 'gray.200'}>
                        <DrawerHeader borderBottomWidth="1px" alignItems="center">
                            <Box display="flex" alignItems="center">
                                <LuSettings display={'inline-block'} size={26} />
                                <Text ml={2}>Settings</Text>
                            </Box>
                        </DrawerHeader>
                        <DrawerBody>
                            <Settings />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Flex>
        </Box>
    );
};

export default Header;
