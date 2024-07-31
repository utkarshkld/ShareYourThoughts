import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/blogs'
import { cors } from 'hono/cors'






const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET:string
  }  
}>()
app.use(
  '*',
  cors())
app.route('/api/v1/user',userRouter)
app.route('/api/v1/blog',blogRouter)

// postgresql://utkarshkld:2DGBQcz1FgTL@ep-blue-wave-a56o34ey.us-east-2.aws.neon.tech/demodb?sslmode=require
// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNGFlNDczMGMtMGY3YS00ZTJmLWJmMzQtNjVlZTY2ZjlmZWM0IiwidGVuYW50X2lkIjoiMjQ5MDEzZDUxMGVlOTU2M2VhZGE1NDFjNTcxODE1NDM0YmNmZDNhYzk3YTk3NTkzMTIyNjQ4NDg0M2NhNTY4ZiIsImludGVybmFsX3NlY3JldCI6IjdjYjAzZTljLTk2MGMtNGVmMy1iMzI1LTdmOGY1ODEyYjQ3NyJ9.OfqRCSeGEoO_sBkjnf8MoDJJIyc34P34twTCQBbjdrw"


export default app
