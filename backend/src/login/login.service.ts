import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './login.user.dto';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {

    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    async authenticate(user: LoginUserDto): Promise<String> {
        
        const foundUser = await this.userService.findByEmail(user.email);

        if (foundUser && await bcrypt.compare(user.password, foundUser.password)) {
            const payload = { username: user.email };
            return await this.jwtService.signAsync(payload);
        }

        throw new Error('Invalid credentials');
    }
}
