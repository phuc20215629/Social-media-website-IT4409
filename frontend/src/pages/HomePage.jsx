import { Box, Flex, Heading, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import Post from '../components/Post';
import SuggestedUsers from '../components/SuggestedUsers';
import useShowToast from '../hooks/useShowToast';

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const res = await fetch('/api/posts/feed');
                const data = await res.json();
                if (data.error) {
                    showToast('Error', data.error, 'error');
                    return;
                }
                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        getFeedPosts();
    }, [showToast, setPosts]);

    return (
        <Flex gap="10" alignItems={'flex-start'}>
            <Box flex={70}>
                {!loading && posts.length === 0 && (
                    <Flex maxW={'sm'} direction={'column'} justify={'center'} alignItems={'center'} mx={'auto'}>
                        <Image
                            src="../../public/empty.png"
                            alt="Empty post feed image"
                            borderRadius="lg"
                            maxW={'xs'}
                            alignItems={'center'}
                        />
                        <Stack spacing="3" alignItems={'center'}>
                            <Heading size="md">Oops, no posts yet!</Heading>
                            <Text>Please follow some user to see their posts.</Text>
                        </Stack>
                    </Flex>
                )}

                {loading && (
                    <Flex justify="center">
                        <Spinner size="xl" />
                    </Flex>
                )}

                {posts.map((post) => (
                    <Post key={post._id} post={post} postedBy={post.postedBy} />
                ))}
            </Box>
            <Box
                flex={30}
                display={{
                    base: 'none',
                    md: 'block',
                }}
            >
                <SuggestedUsers />
            </Box>
        </Flex>
    );
};

export default HomePage;
