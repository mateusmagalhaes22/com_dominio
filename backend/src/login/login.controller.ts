import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './login.user.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    
    constructor(private readonly loginService: LoginService) {}

    @Post()
    create(@Body() user: LoginUserDto): Promise<{ access_token: string }> {
        return this.loginService.authenticate(user);
    }
}
