import { Controller, Post, Get, Body, Param, Query, Delete, Patch, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateuserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('/signup')
    createUser(@Body() body: CreateuserDto) {

        this.userService.create(body.email, body.password);

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
