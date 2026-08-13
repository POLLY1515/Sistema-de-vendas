package br.com.lacasa.sistemavendas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import br.com.lacasa.sistemavendas.repository.UsuarioRepository;
import br.com.lacasa.sistemavendas.security.JwtAuthFilter;
import br.com.lacasa.sistemavendas.security.JwtService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// Cria o JwtAuthFilter e entrega para o Spring gerenciar.
	@Bean
	public JwtAuthFilter jwtAuthFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {

		return new JwtAuthFilter(jwtService, usuarioRepository);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {

		return http

				.csrf(csrf -> csrf.disable())
				.cors(Customizer.withDefaults())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.POST, "/auth/cadastrar", "/auth/login").permitAll()
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/postgres/***").permitAll()
						.anyRequest().authenticated()
						)
						.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
				.httpBasic(httpBasic -> httpBasic.disable())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
}