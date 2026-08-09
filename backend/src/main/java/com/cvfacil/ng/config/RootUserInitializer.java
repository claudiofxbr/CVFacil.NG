package com.cvfacil.ng.config;

import com.cvfacil.ng.model.User;
import com.cvfacil.ng.model.UserRole;
import com.cvfacil.ng.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class RootUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.root.email:}")
    private String rootEmail;

    @Value("${app.root.password:}")
    private String rootPassword;

    @Override
    public void run(String... args) {
        if (rootEmail == null || rootEmail.isBlank()) {
            log.warn("ROOT_EMAIL não configurado. Usuário Root não será criado.");
            return;
        }

        userRepository.findByEmail(rootEmail).ifPresentOrElse(
            user -> log.info("Usuário Root já existe: {}", rootEmail),
            () -> {
                String password = (rootPassword == null || rootPassword.isBlank()) 
                    ? UUID.randomUUID().toString().substring(0, 12) 
                    : rootPassword;
                
                User rootUser = new User();
                rootUser.setEmail(rootEmail);
                rootUser.setUsername("root");
                rootUser.setFullName("Sistema Root");
                rootUser.setPasswordHash(passwordEncoder.encode(password));
                rootUser.setRole(UserRole.ROOT);
                
                userRepository.save(rootUser);
                
                log.info("**************************************************");
                log.info("USUÁRIO ROOT CRIADO COM SUCESSO!");
                log.info("Email: {}", rootEmail);
                if (rootPassword == null || rootPassword.isBlank()) {
                    log.info("Senha Temporária: {}", password);
                    log.warn("POR FAVOR, ALTERE ESTA SENHA NO PRIMEIRO ACESSO!");
                } else {
                    log.info("Senha: [CONFIGURADA VIA ENV]");
                }
                log.info("**************************************************");
            }
        );
    }
}
