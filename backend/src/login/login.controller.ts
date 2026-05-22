import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginUserDto } from './login.user.dto';

@Controller('login')
export class LoginController {
    
    constructor(private readonly loginService: LoginService) {}

    @Post()
    create(@Body() user: LoginUserDto): Promise<{ access_token: string }> {
        return this.loginService.authenticate(user);
    }
}
