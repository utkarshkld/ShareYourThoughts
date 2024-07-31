import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {createPostInput,updatePost} from '@utkarshkld/common-app2.0.1'

import { decode, sign, verify } from 'hono/jwt'
import { use } from 'hono/jsx'
const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>
blogRouter.use('*', async (c, next) => {

    const response = c.req.header('Authorization')
    const tokenarr = response?.split(' ')
    if (tokenarr && tokenarr[0] === "Bearer") {
        const token = tokenarr[1]
        console.log(token)
        try {
            const verificationresp = await verify(token, c.env.JWT_SECRET)
            console.log(verificationresp)            
            c.set('userId', verificationresp.id)
            await next()
            
        } catch (err) {
            console.log('hello')
            console.log(err)
        }

        // console.log(verificationresp)

    }
    c.status(203)
    return c.json({
        message: "Invalid Token"
    })
})

blogRouter.post('/', async (c) => {
    const userId = c.get('userId')
    console.log(userId)
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const temp = await c.req.json()
    let body = createPostInput.safeParse(temp)
    console.log(temp)
    if(!body.success){
        c.status(203)
        return c.json({
            message:"Invalid Inputs"
        })
    }
    
    const response = await prisma.post.create({
        data: {
            title: body.data.title,
            content: body.data.content,
            authorId: userId,
            plainText:temp.plainText,
            thumbnail: temp.thumbnail
        }
    })
    console.log(response)
    return c.json({
        userId: userId,
        message: 'Post Stored',
        postId: response.id
    })
})
blogRouter.put('/edit', async (c) => {
    // logic for updating blog blog goes here
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const temp = await c.req.json()
    const body = updatePost.safeParse(temp)
    if(!body.success){
        return c.json({
            message:"Invalid Inputs"
        })
    }
    const postId = temp.postId
    const newContent = body.data.content
    const newTitle = body.data.title
    const plainText = temp.plainText
    try {
        const response = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                title: newTitle,
                content: newContent,
                plainText:plainText,
                thumbnail:temp.thumbnail,
            }
        })
        return c.json({
            id:postId,
            message:"Post Updated Succussesfully"
        })
    }catch(err){
        console.log(err)
    }    

    return c.json({
        message:"Something Went Wrong"
    })
})
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const response = await prisma.post.findMany({
            where:{},
            select:{
                content:true,
                title:true,
                id:true,
                createdAt:true,
                plainText:true,
                thumbnail:true,
                author:{
                    select:{
                        img:true,
                        id:true,
                        username:true,
                        name:true
                    }
                }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        console.log(response)
        return c.json({
            postsList:response
        })
    }catch(err){
        console.log(err)
    }
    c.status(400)
    return c.json({
        message:"Something Went wrong"
    })    
})
blogRouter.get('/:id', async (c) => {
    // add logic wether the post is liked by the current user or not
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param('id')
    const userId = c.get('userId')
    console.log("in get blog")
    // console.log(id)
    try{       
        
            const responsegetfollowers = await prisma.user.findMany({
                where:{
                    id:userId
                },
                select:{
                    following:{
                        select:{
                            followingId:true
                        }
                    }
                }
            })
            const temp = []
            responsegetfollowers[0].following.map((obj)=>{
                temp.push(obj.followingId)
            })
            const response = await prisma.post.findUnique({
                where:{
                    id:id
                },
                select:{
                    content:true,
                    title:true,
                    id:true,
                    createdAt:true,
                    thumbnail:true,
                    author:{
                        select:{
                            name:true,
                            img:true,
                            id:true,
                            tagline:true
                        }
                    },
                    Likes : true,
                    comments:{
                        select:{
                            content:true,
                            id:true,
                            userId:true,
                            postId:true,
                            createdAt:true,
                            user:{
                                select:{
                                    name:true,
                                    id:true,
                                    img:true
                                }
                            }
                        }
                    }
                }
    
            })
            let isLikedByCurrentUser = false 
            const checklike =  await prisma.like.findFirst({
                where:{
                    postId:id,
                    userId:userId
                }
            })
            const userFollows = await prisma.follow.findFirst({
                where:{
                    followerId:userId,
                    followingId:response?.author.id
                }
            })
            let doFollow = false;
            if(userFollows && userFollows?.length > 0){
                doFollow = true;
            }
            if(checklike){
                isLikedByCurrentUser = true
            }
            const totalLikes = response?.Likes.length;
            const totalcomments = response?.comments.length
            const x = response?.comments.map((comment)=>{
                let t = <any>{...comment}
                if(temp.includes(comment.userId)){
                    t = {...t,"isFollowed":true}
                    return t;
                }
                return {...comment,"isFollowed":false}
            })
            c.status(200)
            return c.json({
                postData:response,
                isLikedByCurrentUser:isLikedByCurrentUser,
                totalLikes:totalLikes,
                totalcomments:totalcomments,
                fetchingFollowing:x,
                temp : temp,
                doFollow:doFollow
            })
        
        
    }catch(err){
        console.log(err)
    }
    c.status(400)
    return c.json({
        message:"Post Not Found or Something went wrong"
    })    
})
blogRouter.post('/addComment/:id',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const postId = c.req.param('id')
    const userId = c.get('userId')
    const temp = await c.req.json()
    const content = temp.content
    try{
        const response = await prisma.comment.create({
            data:{
                content:content,
                userId:userId,
                postId:postId
            },
            select:{
                id:true,
                content:true,
                userId:true,
                postId:true,
                createdAt:true,
                user:{
                    select:{
                        name:true,
                        img:true,
                        id:true,
                    }
                }
            }
        })
        console.log(response)
        return c.json({
            message:"Comment Added Successfully",
            commentData:response
        })
    }catch(e){
        console.log(e)
    }
    return c.json({
        message:"Something Went Wrong"
    })
})
blogRouter.get('/getComment/:id', async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const postId = c.req.param('id')
    const userId = c.get('userId')
    //we got the post id now return the list of comments on the post
    try{
        const response = await prisma.post.findUnique({
            where:{
                id:postId
            },
            select:{
                comments:{
                    select:{
                        content:true,
                        userId:true,
                        postId:true,
                        createdAt:true,
                        user:{
                            select:{
                                img:true,
                                name:true,
                                id:true
                            }
                        }
                    }
                }
            }
        })
        console.log(response)
        return c.json({
            comments:response?.comments
        })
    }catch(e){
        console.log(e)
    }
    return c.json({
        message:"Something Went Wrong"
    })
})

blogRouter.post('/likedislike/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param('id')
    const userId = c.get('userId')

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const response = await prisma.like.findFirst({
                where: {
                    userId: userId,
                    postId: id
                }
            })
            if (!response) {
                // like logic
                const like = await prisma.like.create({
                    data: {
                        userId: userId,
                        postId: id
                    }
                })
                console.log(like)
                return like
            }
            const delterepsonse = await prisma.like.deleteMany({
                where: {
                    userId: userId,
                    postId: id
                }
            })
            console.log(response)
        })        
    } catch (err) {
        console.error(err)
        c.status(400)
        return c.json({
            message: "Post Not Found or Something went wrong"
        })
    }
})
blogRouter.put('/delete/:id', async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param('id')
    const userId = c.get('userId')
    try{
        const response = await prisma.post.delete({
            where:{
                id:id,                
            }
        })
        console.log(response)
        return c.json({
            message:"Post Deleted Successfully",
            response:response
        })
    }catch(e){
        console.log(e)
        return c.json({
            message:e
        })
    }
    return c.json({
        message:"Something Went Wrong"
    })
})


export default blogRouter;