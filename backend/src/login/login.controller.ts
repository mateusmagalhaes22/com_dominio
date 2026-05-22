import { Body, Controller, Post, Options } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from './login.user.dto';

@Controller('login')
export class LoginController {
    
    constructor(private readonly loginService: LoginService) {}

    @Options()
    handleOptions() {
        return {};
    }

    @Post()
    create(@Body() user: LoginUserDto): Promise<{ access_token: string }> {
        return this.loginService.authenticate(user);
    }
}
