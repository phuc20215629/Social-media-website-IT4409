import {
    Avatar,
    Box,
    Button,
    Flex,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Portal,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useFollowUnfollow from '../hooks/useFollowUnfollow';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
    const showToast = useShowToast();
    const toast = useToast();
    const currentUser = useRecoilValue(userAtom); // logged in user
    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isFollower, setIsFollower] = useState('');
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    const handleOpenModal = (type) => {
        setIsFollower(type);
        onOpen();
    };

    useEffect(() => {
        const getFollowersAndFollowings = async () => {
            try {
                const res = await fetch(`api/users/follows/${user._id}`);
                const { followers, followings } = await res.json();
                if (res.error) return showToast('Error', res.error, 'error');
                // console.log(followers);
                setFollowers(followers);
                setFollowings(followings);
            } catch (error) {
                showToast('Error', error.message, 'error');
                setFollowers([]);
                setFollowings([]);
            }
        };
        getFollowersAndFollowings();
    }, [isOpen]);

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: 'Success.',
                status: 'success',
                description: 'Profile link copied.',
                duration: 5000,
                isClosable: true,
            });
        });
    };

    return (
        <>
            <VStack gap={4} alignItems={'start'}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Box>
                        <Text fontSize={'2xl'} fontWeight={'bold'}>
                            {user.name}
                        </Text>
                        <Flex gap={2} alignItems={'center'}>
                            <Text fontSize={'sm'}>{user.username}</Text>
                            <Text
                                fontSize={'xs'}
                                bg={useColorModeValue('gray.300', 'gray.700')}
                                color={useColorModeValue('gray.800', 'white')}
                                p={1}
                                borderRadius={'full'}
                            >
                                social.net
                            </Text>
                        </Flex>
                        <Text fontSize={'md'} fontStyle={'italic'} mt={2}>
                            {user.bio}
                        </Text>
                    </Box>
                    <Box>
                        {user.avatar && (
                            <Avatar
                                name={user.name}
                                src={user.avatar}
                                size={{
                                    base: 'md',
                                    md: 'xl',
                                }}
                            />
                        )}
                        {!user.avatar && (
                            <Avatar
                                name={user.name}
                                src="https://bit.ly/broken-link"
                                size={{
                                    base: 'md',
                                    md: 'xl',
                                }}
                            />
                        )}
                    </Box>
                </Flex>
                {currentUser?._id !== user._id && (
                    <Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
                        {following ? 'Unfollow' : 'Follow'}
                    </Button>
                )}
                <Flex w={'full'} justifyContent={'space-between'}>
                    <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'} cursor={'pointer'} onClick={(e) => handleOpenModal(true)}>
                            {user.followers.length} followers
                        </Text>
                        <Box w="1" h="1" bg={'gray.light'} borderRadius={'full'}></Box>
                        <Text color={'gray.light'} cursor={'pointer'} onClick={(e) => handleOpenModal(false)}>
                            {user.following.length} following
                        </Text>
                    </Flex>
                    <Flex>
                        <Box
                            className="icon-container"
                            _hover={{ backgroundColor: useColorModeValue('gray.200', 'gray.700') }}
                        >
                            <BsInstagram size={24} cursor={'pointer'} />
                        </Box>
                        <Box
                            className="icon-container"
                            _hover={{ backgroundColor: useColorModeValue('gray.200', 'gray.700') }}
                        >
                            <Menu>
                                <MenuButton>
                                    <CgMoreO size={24} cursor={'pointer'} />
                                </MenuButton>
                                <Portal>
                                    <MenuList bg={useColorModeValue('gray.200', 'gray.900')}>
                                        <MenuItem bg={useColorModeValue('gray.200', 'gray.900')} onClick={copyURL}>
                                            Copy link
                                        </MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Box>
                    </Flex>
                </Flex>
                {currentUser?._id === user._id && (
                    <Link as={RouterLink} to="/update" w={'full'}>
                        <Button size={'sm'} colorScheme="gray" borderWidth={2} width={'100%'}>
                            Edit Profile
                        </Button>
                    </Link>
                )}
            </VStack>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent bgColor={useColorModeValue('whitesmoke', 'gray.900')}>
                        <ModalHeader>{isFollower ? 'Followers' : 'Following'}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {isFollower
                                ? followers.map((user, index) => {
                                      return (
                                          <Flex
                                              gap={4}
                                              py={2}
                                              my={2}
                                              px={2}
                                              borderRadius={5}
                                              w={'full'}
                                              as={RouterLink}
                                              to={`/${user.username}`}
                                              key={index}
                                              _hover={{ backgroundColor: useColorModeValue('gray.300', 'gray.700') }}
                                              onClick={(e) => onClose()}
                                          >
                                              <Avatar src={user.avatar} />
                                              <VStack w={'full'} alignItems={'start'} gap={1}>
                                                  <Text fontSize="sm" fontWeight="bold">
                                                      {user.username}
                                                  </Text>
                                                  <Text fontSize="sm" color={'gray'}>
                                                      {user.name}
                                                  </Text>
                                              </VStack>
                                          </Flex>
                                      );
                                  })
                                : followings.map((user, index) => {
                                      return (
                                          <Flex
                                              gap={4}
                                              py={2}
                                              my={2}
                                              px={2}
                                              borderRadius={5}
                                              w={'full'}
                                              as={RouterLink}
                                              to={`/${user.username}`}
                                              key={index}
                                              _hover={{ backgroundColor: useColorModeValue('gray.300', 'gray.700') }}
                                              onClick={(e) => onClose()}
                                          >
                                              <Avatar src={user.avatar} />
                                              <VStack w={'full'} alignItems={'start'} gap={1}>
                                                  <Text fontSize="sm" fontWeight="bold">
                                                      {user.username}
                                                  </Text>
                                                  <Text fontSize="sm" color={'gray'}>
                                                      {user.name}
                                                  </Text>
                                              </VStack>
                                          </Flex>
                                      );
                                  })}
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default UserHeader;
