// Importa o hook useState para gerenciar estados locais do componente
import { useState } from 'react'; 

// Importa componentes do React Native usados na tela
import {
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
} from 'react-native'; 

// Importa o AsyncStorage (armazenamento local persistente do app)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função que representa a tela de login
// "navigation" vem do React Navigation, permitindo navegar entre telas
export default function TelaLogin({ navigation }) { 

  // Estado para armazenar o valor digitado no campo "Usuário"
  const [usuario, setUsuario] = useState('');

  // Estado para armazenar o valor digitado no campo "Apelido"
  const [apelido, setApelido] = useState('');

  // Estado para armazenar o valor digitado no campo "Senha"
  const [senha, setSenha] = useState('');

  // Estado para armazenar mensagem de erro de usuário
  const [erroUsuario, setErroUsuario] = useState('');

  // Função responsável por validar login
  const validarLogin = async () => { 
    // Verifica se o usuário foi preenchido
    if (!usuario.trim()) {
      setErroUsuario('O usuário é obrigatório.');
      return; // Sai da função caso não tenha usuário
    } else {
      setErroUsuario('');
    }

    // Se usuário e senha forem corretos
    if (usuario === 'ASGATITAS' && senha === 'G04') {
      try {
        // Salva o apelido do usuário no armazenamento local
        await AsyncStorage.setItem('usuarioLogado', apelido); 
        // Exibe alerta de sucesso
        Alert.alert('Sucesso!', 'Login realizado com sucesso.');
        // Redireciona para a tela "Catalogo"
        navigation.navigate('Catalogo');
      } catch (e) {
        // Caso haja erro ao salvar no AsyncStorage
        console.error('Erro ao salvar usuário:', e);
      }
    } else {
      // Caso o login esteja incorreto
      Alert.alert(':( Erro', 'Usuário ou senha incorretos.');
    }
  };

  // Retorno da interface da tela
  return (
    // KeyboardAvoidingView ajusta a tela para não "subir" o teclado por cima dos inputs
    <KeyboardAvoidingView
      style={estilos.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // No iOS usa padding, no Android não
    >
      {/* Card central que contém os campos */}
      <View style={estilos.card}> 
        <Text style={estilos.titulo}>Time de Craques</Text>

        {/* Campo Usuário */}
        <View style={estilos.bloco}> 
          <Text style={estilos.rotulo}>Usuário</Text>
          <TextInput
            placeholder="Digite seu usuário" 
            value={usuario} // Valor do estado usuario
            onChangeText={setUsuario} // Atualiza o estado
            style={[estilos.input, erroUsuario ? estilos.inputErro : null]} // Adiciona borda vermelha se houver erro
            placeholderTextColor="#aaa" 
          />
          {/* Mensagem de erro exibida caso usuário esteja vazio */}
          {erroUsuario ? (
            <Text style={estilos.textoErro}>{erroUsuario}</Text>
          ) : null}
        </View>

        {/* Campo Apelido */}
        <View style={estilos.bloco}> 
          <Text style={estilos.rotulo}>Apelido</Text>
          <TextInput
            placeholder="Digite como quer ser chamado" 
            value={apelido} 
            onChangeText={setApelido} 
            style={[estilos.input, erroUsuario ? estilos.inputErro : null]} 
            placeholderTextColor="#aaa" 
          />
          {/* Usa o mesmo erro do usuário (poderia ser separado em outro estado de erro) */}
          {erroUsuario ? (
            <Text style={estilos.textoErro}>{erroUsuario}</Text>
          ) : null}
        </View>

        {/* Campo Senha */}
        <View style={estilos.bloco}>
          <Text style={estilos.rotulo}>Senha</Text> 
          <TextInput
            placeholder="Digite sua senha" 
            value={senha} 
            onChangeText={setSenha} 
            style={estilos.input} 
            placeholderTextColor="#aaa" 
            secureTextEntry // Esconde os caracteres digitados
          />
        </View>

        {/* Botão de login */}
        <TouchableOpacity style={estilos.botao} onPress={validarLogin}> 
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Estilos da tela
const estilos = StyleSheet.create({ 
  container: {
    flex: 1, // Ocupa toda a tela
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
    padding: 20,
    backgroundColor: '#800000', // Cor de fundo vermelho vinho
  },
  card: {
    width: '100%', 
    backgroundColor: '#fff', 
    borderRadius: 16,
    padding: 25, 
    shadowColor: '#000', 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 8, // Sombra no Android
  },
  titulo: {
    fontSize: 28, 
    fontWeight: '800', 
    color: '#800000', 
    textAlign: 'center', 
    marginBottom: 30, 
    letterSpacing: 1, 
  },
  bloco: { marginBottom: 18 }, 
  rotulo: {
    fontSize: 15, 
    fontWeight: '600', 
    color: '#45150d', 
    marginBottom: 8, 
  },
  input: {
    color: 'white', 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 14, 
    backgroundColor: '#800000',
    fontSize: 15, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
  },
  inputErro: { borderColor: '#FF0000' }, // Se erro, mostra borda vermelha
  textoErro: { color: '#FF0000', marginTop: 6, fontSize: 13 }, // Texto de erro em vermelho
  botao: {
    backgroundColor: '#800000', 
    paddingVertical: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10, 
    shadowColor: '#4B0082', 
    shadowOpacity: 0.25, 
    shadowRadius: 6, 
  },
  textoBotao: {
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 17, 
    letterSpacing: 0.5, 
  },
});
