import { Box, Flex, Heading, Image, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { postsAtom, repostsAtom } from '../atoms/postsAtom';
import Post from '../components/Post';
import SuggestedUsers from '../components/SuggestedUsers';
import useShowToast from '../hooks/useShowToast';
import Repost from '../components/Repost';

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [reposts, setReposts] = useRecoilState(repostsAtom);
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
                setPosts(data.feedPosts);
                setReposts(data.feedReposts);
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
                            src="/empty.png"
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

                {reposts.length > 0 &&
                    reposts.map((repost) => <Repost key={repost._id} post={repost.post} postedBy={repost.postedBy} />)}
                {posts.length > 0 && posts.map((post) => <Post key={post._id} post={post} postedBy={post.postedBy} />)}
            </Box>

            <Box
                flex={30}
                display={{
                    base: 'none',
                    md: 'block',
                }}
                position={'sticky'}
                top={40}
                bgColor={useColorModeValue('gray.100', '#101010')}
            >
                <SuggestedUsers />
            </Box>
        </Flex>
    );
};

export default HomePage;
