import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }

    async signup(email: string, password: string) {

        const users = await this.userService.find(email)

        if (users.length) {
            throw new BadRequestException('Email is already been taken!')
        }

        //Generate salt
        const salt = randomBytes(8).toString('hex');

        //Hash the password and salt
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //Join the hashed result ans the salt together
        const result = salt + '.' + hash.toString('hex');

        //Create user
        return await this.userService.create(email, result)

    }

    async signin(email: string, password: string) {

        const [user] = await this.userService.find(email);

        if (!user) {
            throw new NotFoundException('User not found!')
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Bad password');
        }

        return user

    }
}
