import { Flex, Avatar, Box, Text, Image } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Actions from './Actions';
import { useState } from 'react';

const UserPost = ({ likesCount, repliesCount, postTitle, postImg }) => {
    const [liked, setLiked] = useState(false);
    return (
        <Link to={'/phucnguyendinh/post/1'}>
            <Flex gap={3} mb={4} py={5}>
                {/*left side post*/}
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size={'md'} name="phucnguyendinh" src="/public/avatar.JPG" />
                    <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box position={'relative'} w={'full'}>
                        <Avatar
                            size={'xs'}
                            name="lala"
                            src="https://bit.ly/dan-abramov"
                            position={'absolute'}
                            top={'0px'}
                            left={'15px'}
                            padding={'2px'}
                        />
                        <Avatar
                            size={'xs'}
                            name="lala"
                            src="https://bit.ly/tioluwani-kolawole"
                            position={'absolute'}
                            bottom={'0px'}
                            right={'-5px'}
                            padding={'2px'}
                        />
                        <Avatar
                            size={'xs'}
                            name="lala"
                            src="https://bit.ly/kent-c-dodds"
                            position={'absolute'}
                            bottom={'0px'}
                            left={'4px'}
                            padding={'2px'}
                        />
                    </Box>
                </Flex>
                {/*right side post */}
                <Flex flex={1} flexDirection={'column'} gap={1}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'}>
                                Nguyễn Đình Phúc
                            </Text>
                            <Image src="/public/verified.png" w={4} h={4} ml={1} />
                        </Flex>

                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'}>
                                id
                            </Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>

                    <Text fontSize={'sm'}>{postTitle}</Text>
                    {/*Post with image or not */}
                    {postImg && (
                        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={'gray.light'}>
                            <Image src={postImg} w={'full'} />
                        </Box>
                    )}

                    {/*Actions part*/}
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'} fontSize={'sm'}>
                            {repliesCount} replies
                        </Text>
                        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                        <Text color={'gray.light'} fontSize={'sm'}>
                            {likesCount} likes
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default UserPost;
