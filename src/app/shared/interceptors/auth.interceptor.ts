import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getAuthToken();
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Lesson Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
