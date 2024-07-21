import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

export interface PayloadRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this._extraTokenFromHeaders(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const user = await this.jwtService.verifyAsync(token);
      user.id = user.sub;
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
  private _extraTokenFromHeaders(request: any) {
    try {
      const authHeader = request.headers.authorization;
      const token = authHeader.split(' ')[1];
      return token;
    } catch (error) {
      return null;
    }
  }
}
