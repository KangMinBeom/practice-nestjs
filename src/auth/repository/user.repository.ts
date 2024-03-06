import { User } from '../entity/user.entity';
import { SignUpRequestDto } from '../dto/signup-req.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repo.findOneBy({ email });
  }

  async signup(
    signupRequestDto: SignUpRequestDto,
    hashedPassword: string,
  ): Promise<User> {
    const user = new User();
    user.email = signupRequestDto.email;
    user.password = hashedPassword;
    user.username = signupRequestDto.username;
    user.phone = signupRequestDto.phone;

    return this.repo.save(user);
  }
}
