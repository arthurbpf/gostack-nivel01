import {Request, Response} from 'express'
import createUser from './services/CreateUser'

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    email: 'asdas',
    password:'asdasd'
  })  
  
  return response.json({message:'funfou :)'})
}