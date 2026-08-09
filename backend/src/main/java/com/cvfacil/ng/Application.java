package com.cvfacil.ng;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class Application implements org.springframework.boot.CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(Application.class);
    private static long startTime;

    static {
        startTime = System.currentTimeMillis();
        
        // Busca o .env no diretório atual ou no pai (suporte para rodar de dentro de /backend ou da raiz)
        String[] paths = {"./", "../", "../../"};
        boolean loaded = false;
        
        for (String path : paths) {
            try {
                Dotenv dotenv = Dotenv.configure()
                        .directory(path)
                        .ignoreIfMalformed()
                        .load();
                
                dotenv.entries().forEach(e -> {
                    if (System.getProperty(e.getKey()) == null) {
                        System.setProperty(e.getKey(), e.getValue());
                    }
                });
                System.out.println(">>> [TITANIUM] Arquivo .env carregado de: " + path);
                loaded = true;
                break; 
            } catch (Exception e) {
                // Tenta o próximo caminho se o arquivo não existir ou falhar
            }
        }

        if (!loaded) {
            System.err.println(">>> [AVISO] Arquivo .env não encontrado nos caminhos padrão!");
        }

        System.out.println("\n==================================================");
        System.out.println(">>> SINAL DE VIDA v10.3: JVM CARREGOU APPLICATION <<<");
        System.out.println(">>> JAVA_HOME: " + System.getProperty("java.home"));
        System.out.println(">>> MEMORIA LIVRE: " + (Runtime.getRuntime().freeMemory() / 1024 / 1024) + "MB");
        System.out.println("==================================================\n");
    }

    public static void main(String[] args) {
        try {
            System.out.println(">>> INICIANDO SPRING BOOT... <<<");
            SpringApplication.run(Application.class, args);
        } catch (Throwable e) {
            System.err.println("!!! FALHA FATAL NA INICIALIZACAO !!!");
            e.printStackTrace();
            try { Thread.sleep(5000); } catch (Exception ignored) {}
            System.exit(1);
        }
    }

    @org.springframework.beans.factory.annotation.Value("${server.port:8080}")
    private String serverPort;

    @Override
    public void run(String... args) throws Exception {
        long duration = System.currentTimeMillis() - startTime;
        log.info("=============================================");
        log.info("CVFacil.NG Backend - ESTABILIZADO (TITANIUM v10.0)");
        log.info("Tempo total de inicialização: " + duration + "ms");
        log.info("Servidor ouvindo na porta: " + serverPort);
        log.info("=============================================");
    }
}
