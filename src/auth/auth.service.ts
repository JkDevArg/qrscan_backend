import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { V4 as PasetoV4 } from 'paseto';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { Repository } from 'typeorm';
import { generateKey } from 'src/utils/generateKey';
import { LoginDto } from './dto/login.dto';
import { updateEnvVariable } from 'src/utils/updateEnv';
import { Role } from 'src/common/enums/rol.enum';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
    private readonly secretKey: Buffer;

    constructor(
        private readonly usersService: UsersService,
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
    ) { }

    async register(registerDTO: RegisterDto) {
        const user = await this.usersService.findOneByEmail(registerDTO.email);
        if (user) {
            throw new BadRequestException('User already exists');
        }

        const name = `${registerDTO.name} ${registerDTO.surname}`;
        const email = registerDTO.email;

        const nuser = await this.usersService.create({
            name,
            email,
            password: await bcryptjs.hash(registerDTO.password, 10),
            role: registerDTO.have_company ? Role.OPERATOR : Role.USER,
        });

        return {
            status: 201,
            user: {
                name: nuser.name,
                email: nuser.email,
                role: nuser.role
            }
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmailWithPassword(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { email: user.email, role: user.role };

        try {
            const privateKey = await this.getPrivateKey();

            const encodedKey = Buffer.from(privateKey).toString('base64');
            updateEnvVariable('SECRET_TOKEN_KEY', encodedKey);

            // Firmar el token PASETO
            const accessToken = await PasetoV4.sign(payload, privateKey, { expiresIn: '2h' });

            return {
                user: {
                    email: user.email,
                    role: user.role
                },
                backendTokens: {
                    accessToken,
                    expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
                },
            };
        } catch (error) {
            throw new Error(`Failed to sign token: ${error.message}`);
        }
    }

    async refreshToken(email: string) {
        const user = await this.usersService.findByEmailWithPassword(email);
        const payload = { email: user.email, role: user.role };

        const accessToken = await PasetoV4.sign(payload, this.secretKey, { expiresIn: '2h' });

        return {
            accessToken,
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
        };
    }

    async profile({ email }: { email: string }) {
        return await this.usersService.findOneByEmail(email);
    }

    async getPrivateKey(): Promise<string> {
        const key = await this.settingsRepository.findOne({ where: { name: 'apirest' } });
        if (!key) {
            const newKey = generateKey();
            // Guarda la nueva clave en la base de datos
            const newSettings = this.settingsRepository.create({ privateKey: newKey, name: 'apirest' });
            await this.settingsRepository.save(newSettings);

            return newKey;
        }

        return key.privateKey;
    }
}
