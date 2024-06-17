import { ChevronRightIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { postsAtom } from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import DeletePost from '../components/DeletePost';
import UpdatePost from '../components/UpdatePost';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';

const PostPage = () => {
    const currentUser = useRecoilValue(userAtom);
    const { pid } = useParams();
    const { user, loading } = useGetUserProfile();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [likedUsers, setLikedUsers] = useState([]);
    const [repostedUsers, setRepostedUsers] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/liked-reposted/${pid}`);
                const { _likedUsers, _repostedUsers } = await res.json();
                if (res.error) {
                    showToast('Error at InfoModal', res.error, 'error');
                    return;
                }
                setLikedUsers(_likedUsers);
                setRepostedUsers(_repostedUsers);
            } catch (error) {
                showToast('Error at InfoModal', error.message, 'error');
                setLikedUsers([]);
                setRepostedUsers([]);
            }
        };

        getUser();
    }, [isOpen, onClose]);

    const [isUpdatePostOpen, setIsUpdatePostOpen] = useState(false);
    const handleUpdatePostOpen = () => {
        setIsUpdatePostOpen(true);
    };
    const handleUpdatePostClose = () => {
        setIsUpdatePostOpen(false);
    };

    const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
    const handleDeletePostOpen = () => {
        setIsDeletePostOpen(true);
    };
    const handleDeletePostClose = () => {
        setIsDeletePostOpen(false);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const getPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();
                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            }
        };
        getPost();
    }, [showToast, pid, setPosts]);

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
            </Flex>
        );
    }

    if (!user || !posts) {
        return (
            <Flex fontWeight={'600'} fontSize={'30'} textColor={' rgb(100 116 139)'}>
                User not found!!!
            </Flex>
        );
    }

    if (!posts[0]) return null;

    return (
        <>
            <Flex>
                <Flex as={Link} to={`/${user.username}`} w={'full'} alignItems={'center'} gap={3}>
                    <Flex gap={2} justifyContent="center" alignItems="center">
                        <Avatar src={user.avatar} size={'md'} name={user.name} />
                        <VStack>
                            <Text fontSize={'sm'} fontWeight={'bold'} alignSelf={'start'}>
                                {user.username}
                                <Image src="/verified.png" w="4" h={4} display={'inline-block'} ml={1} />
                            </Text>
                            {posts[0].createdAt !== posts[0].updatedAt && (
                                <Flex color="gray.400" flexDirection={'row'}>
                                    <EditIcon />
                                    <Box
                                        fontSize="small"
                                        fontWeight="bold"
                                        alignSelf="start"
                                        display="inline-block"
                                        ml={1}
                                    >
                                        edited {formatDistanceToNow(new Date(posts[0].updatedAt))} ago
                                    </Box>
                                </Flex>
                            )}
                        </VStack>
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={'center'}>
                    <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>
                        {formatDistanceToNow(new Date(posts[0].createdAt))} ago
                    </Text>

                    {currentUser?._id === user._id && (
                        <>
                            <Button onClick={handleDeletePostOpen} size={'sm'}>
                                <DeleteIcon />
                            </Button>
                            <Button onClick={handleUpdatePostOpen} size={'sm'}>
                                <EditIcon />
                            </Button>
                            <DeletePost post={posts[0]} open={isDeletePostOpen} close={handleDeletePostClose} />
                            <UpdatePost post={posts[0]} open={isUpdatePostOpen} close={handleUpdatePostClose} />
                        </>
                    )}
                </Flex>
            </Flex>
            <Text my={3}>{posts[0].text}</Text>
            {posts[0].img && (
                <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                    <Image src={posts[0].img} w={'full'} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={posts[0]} />
            </Flex>

            <Divider variant={'solid'} my={4} />

            <Flex>
                <Text fontSize={'sm'} fontWeight={'bold'} color={'gray.500'}>
                    Replies
                </Text>
                <Spacer />
                <Text fontSize={'sm'} color={'gray.500'} cursor={'pointer'} onClick={onOpen}>
                    View activity
                    <ChevronRightIcon boxSize={5} />
                </Text>
            </Flex>

            <Divider variant={'solid'} my={4} />

            {posts[0].replies.map((reply) => {
                return (
                    <>
                        <Comment
                            key={reply._id}
                            reply={reply}
                            lastReply={reply._id === posts[0].replies[posts[0].replies.length - 1]._id}
                        />
                    </>
                );
            })}

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor={useColorModeValue('whitesmoke', 'gray.900')}>
                    <ModalHeader alignSelf={'center'}>Post activity</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs isFitted>
                            <TabList>
                                <Tab>Likes ({posts[0].likes.length})</Tab>
                                <Tab>Reposts ({posts[0].reposts.length})</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel px={0}>
                                    {likedUsers.map((user, index) => {
                                        return (
                                            <Flex
                                                gap={4}
                                                py={2}
                                                my={2}
                                                px={2}
                                                borderRadius={5}
                                                w={'full'}
                                                as={Link}
                                                to={`/${user.username}`}
                                                key={index}
                                                _hover={{ backgroundColor: useColorModeValue('gray.300', 'gray.700') }}
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
                                </TabPanel>
                                <TabPanel p={0}>
                                    {repostedUsers.map((user, index) => {
                                        return (
                                            <Flex
                                                gap={4}
                                                py={2}
                                                my={2}
                                                px={2}
                                                borderRadius={5}
                                                w={'full'}
                                                as={Link}
                                                to={`/${user.username}`}
                                                key={index}
                                                _hover={{ backgroundColor: useColorModeValue('gray.300', 'gray.700') }}
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
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PostPage;
