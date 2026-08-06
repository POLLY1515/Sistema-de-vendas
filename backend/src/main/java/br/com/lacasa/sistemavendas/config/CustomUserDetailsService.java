package br.com.lacasa.sistemavendas.config;


import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.entity.Usuario;
import br.com.lacasa.sistemavendas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService  implements UserDetailsService{

	
	private final UsuarioRepository usuarioRepository;
	
	
	@Override
	public UserDetails loadUserByUsername(String email) 
			throws UsernameNotFoundException {
		Usuario usuario = usuarioRepository
				.findByEmailIgnoreCase(email)
				.orElseThrow(() ->
				new UsernameNotFoundException("Usuario não encontrado!"));
		
		
		return User.builder()
				.username(usuario.getEmail())
				.password(usuario.getSenha())
				.roles(usuario.getPerfil().name())
				.disabled(!usuario.getAtivo())
				.build();
	}

}
