package br.com.lacasa.sistemavendas.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	@Value("${jwt.secret}")
	private String secret;
	
	@Value("${jwt.expiracao}")
	private Long expiracao;
	
	
	public String gerarToken(Usuario usuario) {
		Date agora = new Date();
		Date dataExpiracao = new Date(agora.getTime() + expiracao);
		
		return Jwts.builder() 
				.subject(usuario.getEmail())
				.claim("perfil", usuario.getPerfil().name())
				.issuedAt(agora)
				.expiration(dataExpiracao)
				.signWith(getSigningKey())
				.compact();
	}
	
	public String extrairEmail(String token) {
		return extrairClaims(token).getSubject();
	}
	
	public boolean tokenValido(String token, String emailUsuario) {
	
	String emailToken = extrairEmail(token);
	return emailToken.equals(emailUsuario) && !tokenExpirado(token);
	}
	
	private boolean tokenExpirado(String token) {
	return extrairClaims(token).getExpiration().before(new Date());
	}
	
	
	private Claims extrairClaims(String token) {
	return Jwts.parser()
	.verifyWith(getSigningKey())
	.build()
	.parseSignedClaims(token)
	.getPayload();
	}
	
	private SecretKey getSigningKey() {
	byte[] chaveBytes = secret.getBytes(StandardCharsets.UTF_8);
	return Keys.hmacShaKeyFor(chaveBytes);
	}
	
	
	


}
