package com.cvfacil.ng.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    private static final Duration ENTRY_TTL = Duration.ofMinutes(10);

    private record BucketEntry(Bucket bucket, Instant lastAccess) {
    }

    // Mapa para armazenar baldes por endereço IP
    private final Map<String, BucketEntry> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String ip) {
        evictExpired();
        BucketEntry entry = cache.compute(ip, (key, existing) ->
                new BucketEntry(existing != null ? existing.bucket() : newBucket(), Instant.now()));
        return entry.bucket();
    }

    private void evictExpired() {
        Instant threshold = Instant.now().minus(ENTRY_TTL);
        cache.values().removeIf(entry -> entry.lastAccess().isBefore(threshold));
    }

    private Bucket newBucket() {
        // Limite: 5 requisições por minuto para endpoints sensíveis (Login)
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
