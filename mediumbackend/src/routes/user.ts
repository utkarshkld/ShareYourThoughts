import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import z from 'zod'
import { decode, sign, verify } from 'hono/jwt'
import {SignInInput,SignupInput,signinInput,signupInput} from '@utkarshkld/common-app2.0.1'
import { storage } from '../Firebase/firebase'
import { ref,uploadBytes } from 'firebase/storage'
// export type SignInInput = z.infer<typeof signinInput>
// export type SignupInput = z.infer<typeof signupInput>
// export type CreatePostInput = z.infer<typeof createPostInput>
// export type UpdatePost = z.infer<typeof updatePost>
const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string,
      JWT_SECRET:string
    },
    Variables: {
      userId: string
  }
  }>()
//   const validation = z.object({
//     name:z.string().max(30),
//     password:z.string().min(6).max(20),
//     email:z.string()
//   })
const func = async (c:any, next:any) => {

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
}

  
  userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const bodybeforeValidation = await c.req.json()
    const body = signupInput.safeParse(bodybeforeValidation)
    // console.log(body)
    if(body.success){
      try{
        const response = await prisma.user.create({
          data:{
            username:body.data.email,
            password:body.data.password,
            name:body.data.name
          },
          select:{
            id:true,
            username:true,
            name:true,
            img:true,
            tagline:true
          }
        })
        // console.log(response)
        
        const jwt = await sign({id:response.id},c.env.JWT_SECRET)
        // console.log(jwt)
        c.status(200)
        return c.json({
          message:"User Added Successfully :)",
          token:jwt,
          data:response
        })
        
      }catch(err){
        console.log(err)
        console.log("Something went wrong")
      }    
    }
    
    // console.log(response)
    c.status(403)
    return c.json({
      message:"Something went wrong"
    })
  })
  userRouter.use('/editDetails',func)
  userRouter.use('/getMyDetails',func)
  userRouter.use('/getMyLikedPosts',func)
  userRouter.use('/followUnfollow/:id',func)
  userRouter.use('/removeFollwer',func)
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    // // no zod validation here
    const temp = await c.req.json()
    const body = signinInput.safeParse(temp)
    // console.log(body)
    if(!body.success){
        return c.json({
            message:"Invalid Inputs"
        })
    }
    const response = await prisma.user.findUnique({
      where:{
        username:body.data.email
      },
      select:{
        id:true,
        username:true,
        password:true,
        name:true,
        img:true,
        tagline:true
      } 
    })
    // console.log(response)
    if(!response){
      // No user was found
      return c.json({
        message:"No user was found"
      })
    }
    if(body.data.password && body.data.password === response.password){
      const jwt =  await sign({id:response.id},c.env.JWT_SECRET)
      const data = {
        id:response.id,
        username:response.username,
        name:response.name,
        img:response.img,
        tagline:response.tagline
      }
      
      return c.json({
        success:true,
        message:"User Signed In",
        token:jwt,
        data:data
      })
    }
    return c.json({
      success:false,
      message:"Invalid credentials"
    })
  })
  userRouter.get('/getUserDetails/:id', async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param('id')
    try{
      const response = await prisma.user.findUnique({
        where:{
          id:id
        },
        select:{
          id:true,
          username:true,
          name:true,
          img:true,
          tagline:true          
        }
      })
      return c.json({
        response:response
      })
    }catch(e){
      console.log(e)
    }
  })
  userRouter.get('/getMyDetails', async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.get('userId')
    try{
      const response = await prisma.user.findUnique({
        where:{
          id:id
        },
        select:{
          id:true,
          username:true,
          password:true,
          name:true,
          img:true,
          tagline:true          
        }
      })
      return c.json({
        response:response
      })
    }catch(e){
      console.log(e)
    }
    return c.json({
      message:"Something went wrong"
    })
  })
  userRouter.put('/editDetails',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.get('userId')
    const temp = await c.req.json()
    
    try{
      const response = await prisma.user.update({
        where:{
          id:id
        },
        data:{
          name:temp.name,
          password:temp.password,
          tagline:temp.tagline,             
          img:temp.img,          
        },
        select:{
          password:true,
          name:true,
          img:true,
          username:true,
          tagline:true
        }
      })
      return c.json({
        response:response
      })
    }catch(e){
      console.log(e)
    }
    return c.json({
      message:"Something went wrong"
    })
  })
  userRouter.get('/getUserPosts/:id',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.req.param('id')
    try{
      const response = await prisma.user.findMany({
        where:{
          id:id
        },
        select:{
          posts:{
            select:{
              id:true,
              title:true,
              content:true,
              plainText:true,
              createdAt:true,    
              thumbnail:true,          
            }
          }
        }
      })
      return c.json({
        response:response
      })
    }catch(e){
      console.log(e)
    }
    return c.json({
      message:"Something went wrong"
    })
  })
  userRouter.get('/getMyLikedPosts',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = c.get('userId')
    try{
      const response = await prisma.post.findMany({
        where:{
          Likes:{
            some:{
              userId:id
            }
          }
        },     
        select:{
          id:true,
          title:true,
          content:true,
          plainText:true,
          createdAt:true,    
          thumbnail:true,
        }  

    })
    
      return c.json({
        response:response
      })
    }catch(e){
      console.log(e)
    }
    return c.json({
      message:"Something went wrong"
    })
  })
  userRouter.use('/followUnfollow/:id',func)
  userRouter.post('/followUnfollow/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get('userId');
    const id = c.req.param('id');

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const existingFollow = await prisma.follow.findFirst({
                where: {
                    followerId: userId,
                    followingId: id,
                },
            });

            if (!existingFollow) {
                const followResponse = await prisma.follow.create({
                    data: {
                        followerId: userId,
                        followingId: id,
                    },
                });
                return {
                    message: "Followed successfully",
                    data: followResponse,
                };
            }

            const unfollowResponse = await prisma.follow.deleteMany({
                where: {
                    followerId: userId,
                    followingId: id,
                },
            });
            return {
                message: "Unfollowed successfully",
                data: unfollowResponse,
            };
        });

        c.status(200);
        return c.json(result);
    } catch (error:any) {
        console.log(error);
        c.status(500);
        return c.json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});
userRouter.get('/getFollowers/:id',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const id = c.req.param('id')
  const response = await prisma.follow.findMany({
    where:{
      followingId:id
    },
    select:{
      follower:{
        select:{
          id:true,
          username:true,
          name:true,
          // img:true,
          tagline:true
        }
      }
    }
  })
  return c.json({
    response:response,
    count:response.length
  })

})
userRouter.get('/getFollowing/:id',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const id = c.req.param('id')
  console.log(id)
  const response = await prisma.follow.findMany({
    where:{
      followerId:id
    },
    select:{
      following:{
        select:{
          id:true,
          username:true,
          name:true,
          img:true,
          tagline:true
        }
      }
    }
  })
  return c.json({
    response:response,
    count:response.length
  })
})
userRouter.put('/removeFollwer/:id',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get('userId');
  const id = c.req.param('id')
  const response = await prisma.follow.deleteMany({
    where:{
      followingId:c.get('userId'),
      followerId:id
    }
  })
  return c.json({
    response:response,
    message:"Follower removed successfully"
  })
})
userRouter.put('/removeFollowing/:id',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get('userId');
  const id = c.req.param('id')
  const response = await prisma.follow.deleteMany({
    where:{
      followerId:c.get('userId'),
      followingId:id
    }
  })
  return c.json({
    response:response,
    message:"Follower removed successfully"
  })
})
  export default userRouter;