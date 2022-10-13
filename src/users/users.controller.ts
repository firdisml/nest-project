import { Controller, Post, Get, Body, Param, Query, Delete, Patch, Session, UseGuards } from '@nestjs/common';
import { CreateuserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { Currentuser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';



@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private userService: UsersService, private authService: AuthService) { }


    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@Currentuser() user:User){
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateuserDto, @Session() session:any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signin')
    async logUser(@Body() body: CreateuserDto, @Session() session:any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId = null
    }
    
    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.userService.findOne(parseInt(id));
    }

    @Get()
    findAllUser(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }




}
