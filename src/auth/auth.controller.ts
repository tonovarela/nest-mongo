import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,RegisterUserDto,UpdateUserDto } from './dto';

import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){
    
  }
    

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post("/login")
  login(@Body() loginDTO:LoginDto) {
    return this.authService.login(loginDTO);
  }


  @Post("/register")
  register(@Body() registerDTO:RegisterUserDto) {
    return this.authService.register(registerDTO);
  }
  

  @Get('/check-token')
  @UseGuards(AuthGuard)
  checkToken(@Request() req:Request):LoginResponse  {
    const user = req["user"] as User;

    return  {
      user,
      token:this.authService.getJWT({id:user._id})
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req:Request) {
    const user = req["user"];
    return  user;
    //console.log(req);
  //  return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
