package br.com.lacasa.sistemavendas.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.dto.LoginResponseDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioCadastroRequestDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioLoginRequestDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioResponseDTO;
import br.com.lacasa.sistemavendas.entity.Usuario;
import br.com.lacasa.sistemavendas.repository.UsuarioRepository;
import br.com.lacasa.sistemavendas.security.JwtService;
import jakarta.transaction.Transactional;

@Service
public class AuthService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService

	) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@Transactional
	public UsuarioResponseDTO cadastrar(UsuarioCadastroRequestDTO dto) {
		if (usuarioRepository.existsByEmailIgnoreCase(dto.email())) {
			throw new RuntimeException("Já existe usuario com este email");
		}

		Usuario usuario = new Usuario();
		usuario.setNome(dto.nome());
		usuario.setEmail(dto.email());
		usuario.setSenha(passwordEncoder.encode(dto.senha()));
		usuario.setPerfil(dto.perfil());
		usuario.setAtivo(true);

		Usuario salvo = usuarioRepository.save(usuario);
		return transformarEmResponse(salvo);
	}

	public LoginResponseDTO login(UsuarioLoginRequestDTO dto) {
		Usuario usuario = usuarioRepository.findByEmailIgnoreCase(dto.email())
				.orElseThrow(() -> new RuntimeException("E-mail ou senha inválidos"));

		boolean senhaCorreta = passwordEncoder.matches(dto.senha(), usuario.getSenha());

		if (!senhaCorreta || !usuario.getAtivo()) {
			throw new RuntimeException("Email ou senha inválidos");
		}
		
		String token = jwtService.gerarToken(usuario);

		return new LoginResponseDTO(token,"Bearer", transformarEmResponse(usuario));
		//return new LoginResponseDTO(token, "Bearer", transformarEmResponse(usuario));
	}

	private UsuarioResponseDTO transformarEmResponse(Usuario usuario) {
		return new UsuarioResponseDTO(usuario.getId(), usuario.getNome(), usuario.getEmail(), usuario.getPerfil(),
				usuario.getAtivo());
	}
}