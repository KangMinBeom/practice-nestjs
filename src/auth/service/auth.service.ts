import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class authService {
  constructor(private readonly userRepository: UserRepository) {}

  //   async login(email: string, password: string, req: RequestInfo){

  //   };

  //   private async validateUser{
  //     email: string,
  //     password: string,
  //     }: Promise<User>{
  //         const user = this.userRepository.findOne({email});
  //         if( user && (await bcrypt.compare(password, user.password))){

  //         }
  //     }
}
