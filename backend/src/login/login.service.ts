import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './login.user.dto';
import { UserService } from 'src/users/user.service';
import { WorkspaceService } from 'src/workspaces/workspace.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class LoginService {

    constructor(
        private readonly userService: UserService, 
        private readonly workspaceService: WorkspaceService,
        private jwtService: JwtService
    ) {}

    async authenticate(user: LoginUserDto): Promise<{ access_token: string; workspaceId?: number; user: { id: number; name: string; email: string } }> {
        
        const foundUser = await this.userService.findByEmail(user.email);

        if (!foundUser) {
            throw new UnauthorizedException('Email not found');
        }

        const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Buscar a workspace do usuário
        const workspace = await this.workspaceService.findByUserId(foundUser.id!);

        const payload = { username: user.email, sub: foundUser.id };
        const token = await this.jwtService.signAsync(payload, { expiresIn: jwtConstants.expiresIn });
        
        return { 
            access_token: token,
            workspaceId: workspace?.id,
            user: {
                id: foundUser.id!,
                name: foundUser.name,
                email: foundUser.email
            }
        };
    }
}
