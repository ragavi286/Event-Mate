package com.eventmate.server.controller;

import com.eventmate.server.dto.AuthResponseDto;
import com.eventmate.server.dto.LoginDto;
import com.eventmate.server.dto.RegisterDto;
import com.eventmate.server.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to connect
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        try {
            String token = authService.login(loginDto);
            // Use the record's constructor
            return ResponseEntity.ok(new AuthResponseDto(token, "User logged in successfully!"));
        } catch (Exception e) {
            // Use the record's constructor for error response
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponseDto(null, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        try {
            authService.register(registerDto);
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

