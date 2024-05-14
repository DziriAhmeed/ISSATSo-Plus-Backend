// jwt-payload.dto.ts

export class JwtPayload {
    sub: number;
    email: string;
    role: string;
    fullName: string;
    profilePictureUrl: string;
  }