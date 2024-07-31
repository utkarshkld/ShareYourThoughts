import z from 'zod'

export const signupInput = z.object({
    name:z.string().max(30),
    password:z.string().min(6).max(20),
    email:z.string()
  })
export const signinInput = z.object({
    email:z.string(),
    password:z.string()
})
export const createPostInput = z.object({
    title:z.string(),
    content:z.string()
})
export const updatePost = z.object({
    title:z.string().optional(),
    content:z.string().optional()
})

export type SignInInput = z.infer<typeof signinInput>
export type SignupInput = z.infer<typeof signupInput>
export type CreatePostInput = z.infer<typeof createPostInput>
export type UpdatePost = z.infer<typeof updatePost>