package br.com.lacasa.sistemavendas.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import br.com.lacasa.sistemavendas.entity.Usuario;
import br.com.lacasa.sistemavendas.repository.UsuarioRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository) {

        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String email = jwtService.extrairEmail(token);

            if (email == null || email.isBlank()) {
                responderNaoAutorizado(
                        response,
                        "Token inválido."
                );
                return;
            }

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                Usuario usuario = usuarioRepository
                        .findByEmailIgnoreCase(email)
                        .orElse(null);

                if (usuario == null) {
                    responderNaoAutorizado(
                            response,
                            "Usuário do token não encontrado."
                    );
                    return;
                }

                if (!jwtService.tokenValido(
                        token,
                        usuario.getEmail())) {

                    responderNaoAutorizado(
                            response,
                            "Token inválido ou expirado."
                    );
                    return;
                }

                SimpleGrantedAuthority permissao =
                        new SimpleGrantedAuthority(
                                "ROLE_" + usuario.getPerfil().name()
                        );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                usuario.getEmail(),
                                null,
                                List.of(permissao)
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {

            SecurityContextHolder.clearContext();

            responderNaoAutorizado(
                    response,
                    "Token expirado. Faça login novamente."
            );

        } catch (JwtException | IllegalArgumentException e) {

            SecurityContextHolder.clearContext();

            responderNaoAutorizado(
                    response,
                    "Token inválido."
            );
        }
    }

    private void responderNaoAutorizado(
            HttpServletResponse response,
            String mensagem)
            throws IOException {

        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
        );

        response.setContentType(
                "application/json;charset=UTF-8"
        );

        String mensagemSegura =
                mensagem.replace("\"", "\\\"");

        response.getWriter().write(
                "{\"mensagem\":\""
                        + mensagemSegura
                        + "\"}"
        );
    }
}