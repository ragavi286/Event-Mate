package com.eventmate.server.service;

import com.eventmate.server.dto.LoginDto;
import com.eventmate.server.dto.RegisterDto;
import com.eventmate.server.model.User;
import com.eventmate.server.repository.UserRepository;
import com.eventmate.server.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        // UPDATED: Use record accessor methods email() and password()
                        loginDto.email(),
                        loginDto.password()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtil.generateToken(authentication);
    }

    public void register(RegisterDto registerDto) {
        // UPDATED: Use record accessor method email()
        if (userRepository.findByEmail(registerDto.email()).isPresent()) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        // UPDATED: Use record accessor methods name(), email(), etc.
        user.setName(registerDto.name());
        user.setEmail(registerDto.email());
        user.setRole(registerDto.role());
        user.setPassword(passwordEncoder.encode(registerDto.password()));

        userRepository.save(user);
    }
}

