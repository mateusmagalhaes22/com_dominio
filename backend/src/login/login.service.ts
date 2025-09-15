import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './login.user.dto';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class LoginService {

    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    async authenticate(user: LoginUserDto): Promise<String> {
        
        const foundUser = await this.userService.findByEmail(user.email);

        if (!foundUser) {
            throw new UnauthorizedException('Email not found');
        }

        const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { username: user.email, sub: foundUser.id };
        return await this.jwtService.signAsync(payload, { expiresIn: jwtConstants.expiresIn });
    }
}
