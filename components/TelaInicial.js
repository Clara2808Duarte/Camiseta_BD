import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; 
// Importa os componentes básicos do React Native:
// View: contêiner
// Text: exibe texto
// TouchableOpacity: botão clicável com efeito de opacidade
// StyleSheet: para criar estilos

export default function TelaInicial({ navigation }) {
  // Função principal da tela inicial, recebe o objeto navigation
  // usado para navegar entre telas do app
  return (
    <View style={styles.container}>
      {/* Nome do App */}
      <Text style={styles.titulo}> Loja de Camisetas </Text>

      {/* Botão para entrar na tela de login */}
      <TouchableOpacity
        style={styles.botao} // estilo do botão
        onPress={() => navigation.navigate("Login")} 
        // ao clicar, navega para a tela "Login"
      >
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda a tela
    backgroundColor: '#800000', // cor de fundo bordô
    alignItems: 'center', // centraliza horizontalmente
    justifyContent: 'center', // centraliza verticalmente
  },
  titulo: {
    fontSize: 32, // tamanho da fonte
    fontWeight: 'bold', // texto em negrito
    color: '#F5F5DC', // cor do texto: bege
    marginBottom: 40, // espaço abaixo do título
  },
  botao: {
    backgroundColor: '#F5F5DC', // cor do botão: bege
    paddingVertical: 12, // espaçamento vertical interno
    paddingHorizontal: 40, // espaçamento horizontal interno
    borderRadius: 8, // cantos arredondados
  },
  textoBotao: {
    fontSize: 18, // tamanho do texto do botão
    fontWeight: 'bold', // negrito
    color: '#800000', // cor do texto: bordô
  },
});
