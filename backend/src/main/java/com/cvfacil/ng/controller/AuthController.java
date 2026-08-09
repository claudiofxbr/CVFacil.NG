package com.cvfacil.ng.controller;

import com.cvfacil.ng.dto.AuthenticationResponse;
import com.cvfacil.ng.dto.LoginRequest;
import com.cvfacil.ng.dto.RegisterRequest;
import com.cvfacil.ng.model.User;
import com.cvfacil.ng.repository.UserRepository;
import com.cvfacil.ng.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.cvfacil.ng.service.RateLimitingService rateLimitingService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, jakarta.servlet.http.HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        if (!rateLimitingService.resolveBucket(ip).tryConsume(1)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("{\"error\": \"Muitas tentativas. Tente novamente em 1 minuto.\"}");
        }
        try {
            log.debug("[AUTH] Tentativa de login para IP: {} - E-mail: {}", ip, request.getEmail());
            
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            log.debug("[AUTH] Autenticação bem-sucedida via AuthenticationManager.");
            
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário autenticado mas não encontrado no banco!"));
            
            String jwtToken = jwtService.generateToken(user);
            log.info("[AUTH-SUCCESS] Login realizado com sucesso para: {}", user.getEmail());
            
            // Detecção de ambiente para persistência de cookie (Sênior Fix)
            boolean isLocal = ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || servletRequest.getServerName().equals("localhost");

            ResponseCookie jwtCookie = ResponseCookie.from("auth_token", jwtToken)
                    .httpOnly(true)
                    .secure(!isLocal) 
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(AuthenticationResponse.builder()
                            .token(jwtToken)
                            .user(user)
                            .build());
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.warn("[AUTH-FAIL] Falha de autenticação (Senha/Email): {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\": \"E-mail ou senha inválidos\"}");
        } catch (Exception e) {
            log.error("[AUTH-CRITICAL] Falha inesperada no login (Possível queda de DB/Rede): {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Falha na comunicação com o servidor de persistência.\"}");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, jakarta.servlet.http.HttpServletRequest servletRequest) {
        log.info("[AUTH] Tentativa de registro para e-mail: {}", request.getEmail());
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("[AUTH-WARN] Registro negado: e-mail já existe.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"E-mail já está em uso\"}");
        }
        
        // Padronização: Embora o username possa existir, a identidade principal é o e-mail.
        // Mantemos a unicidade do 'username' caso o front-end o utilize para perfis públicos.
        if (request.getUsername() != null && userRepository.findByUsername(request.getUsername()).isPresent()) {
            log.warn("[AUTH-WARN] Registro negado: nome de usuário já existe.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Nome de usuário já está em uso\"}");
        }

        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setUsername(request.getUsername() != null ? request.getUsername() : request.getEmail());
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(com.cvfacil.ng.model.UserRole.USER);
        
        try {
            userRepository.save(newUser);
            log.info("[AUTH-SUCCESS] Usuário registrado com sucesso: {}", request.getEmail());
        } catch (Exception e) {
            log.error("[AUTH-ERROR] Falha crítica ao salvar usuário: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erro interno ao processar cadastro\"}");
        }
        
        String jwtToken = jwtService.generateToken(newUser);

        // Detecção de ambiente para persistência de cookie (mesma lógica do login)
        String ip = servletRequest.getRemoteAddr();
        boolean isLocal = ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || servletRequest.getServerName().equals("localhost");

        ResponseCookie jwtCookie = ResponseCookie.from("auth_token", jwtToken)
                .httpOnly(true)
                .secure(!isLocal)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(AuthenticationResponse.builder()
                        .token(jwtToken)
                        .user(newUser)
                        .build());
    }

    @GetMapping("/profile-lookup")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> profileLookup(@RequestParam String email,
                                            org.springframework.security.core.Authentication authentication) {
        if (!authentication.getName().equalsIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("error", "Só é permitido consultar o próprio perfil"));
        }
        String photoUrl = userRepository.findByEmail(email)
                .map(User::getPhotoUrl)
                .orElse(null);
        return ResponseEntity.ok(java.util.Collections.singletonMap("photoUrl", photoUrl));
    }
}
