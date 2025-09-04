import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaDetalhes({ route }) {
  const [apelido, setApelido] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      const salvo = await AsyncStorage.getItem('usuarioLogado');
      if (salvo) setApelido(salvo);
    };
    carregarUsuario();
  }, []);

  const { produto } = route.params;

  const coresDisponiveis = ['Branco', 'Preto', 'Azul', 'Vermelho'];
  const tamanhosDisponiveis = ['P', 'M', 'G', 'GG'];

  const [cep, setCep] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState('Econômica');
  const [erroCep, setErroCep] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const precoNumber = Number(produto.preco) || 139.99;

  const somenteDigitos = (texto) => texto.replace(/\D/g, '');

  const validarCep = (valor) => {
    const limpo = somenteDigitos(valor);
    if (limpo.length !== 8) {
      setErroCep('CEP inválido. Deve ter 8 dígitos.');
      return false;
    }
    setErroCep('');
    return true;
  };

  const calcularFrete = () => {
    let base = metodoEntrega === 'Econômica' ? 12.9 : 29.9;
    const cepLimpo = somenteDigitos(cep);

    if (cepLimpo.length === 8) {
      const primeiro = cepLimpo[0];
      const ultimo = cepLimpo[7];
      if (['0', '1', '2'].includes(primeiro)) base += 5;
      if (Number(ultimo) % 2 === 0) base -= 2;
    }
    return Math.max(base, 0);
  };

  const calcularTotal = () => {
    const frete = calcularFrete();
    return (precoNumber * quantidade + frete).toFixed(2);
  };

  const BotaoEntrega = ({ valor, rotulo }) => {
    const ativo = metodoEntrega === valor;
    return (
      <TouchableOpacity
        onPress={() => setMetodoEntrega(valor)}
        style={[estilos.botaoEntrega, ativo && estilos.botaoEntregaAtivo]}
      >
        <Text style={[estilos.textoEntrega, ativo && estilos.textoEntregaAtivo]}>
          {rotulo}
        </Text>
      </TouchableOpacity>
    );
  };

  const confirmarCompra = () => {
    if (!validarCep(cep)) {
      Alert.alert('Erro', 'Digite um CEP válido antes de continuar.');
      return;
    }
    const frete = calcularFrete();
    Alert.alert(
      'Pedido confirmado!',
      `Produto: ${produto.nome}\nPreço unitário: R$ ${precoNumber.toFixed(
        2
      )}\nQuantidade: ${quantidade}\nFrete: R$ ${frete.toFixed(
        2
      )}\nTotal: R$ ${calcularTotal()}\nMétodo: ${metodoEntrega}`
    );
  };

  const salvarListaDesejos = async () => {
    try {
      if (!apelido) {
        Alert.alert('Erro', 'Você precisa estar logado para salvar desejos.');
        return;
      }

      const lista = await AsyncStorage.getItem('listaDesejos');
      let listaDesejos = lista ? JSON.parse(lista) : [];

      // Verifica se o produto já está na lista
      const jaAdicionado = listaDesejos.some(
        (item) => item.produto.id === produto.id
      );
      if (jaAdicionado) {
        Alert.alert('Atenção', 'Este produto já está na sua lista de desejos!');
        return;
      }

      // Adiciona novo item
      listaDesejos.push({ apelido, produto });

      await AsyncStorage.setItem('listaDesejos', JSON.stringify(listaDesejos));

      Alert.alert('Sucesso', 'Produto adicionado à lista de desejos!');
      // NÃO navega para a lista, permanece na tela de detalhes
    } catch (e) {
      console.error('Erro ao salvar na lista de desejos:', e);
      Alert.alert('Erro', 'Não foi possível adicionar à lista.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        style={estilos.container}
      >
        <Text style={estilos.saudacao}>Bem-vindo, {apelido}!</Text>
        <Image source={produto.imagem} style={estilos.imagem} />
        <Text style={estilos.nome}>{produto.nome}</Text>
        <Text style={estilos.preco}>R$ {precoNumber.toFixed(2)}</Text>
        <Text style={estilos.descricao}>
          Camiseta oficial do time {produto.nome}. Confeccionada em material de
          alta qualidade, ideal para torcedores apaixonados.
        </Text>

        <Text style={estilos.tituloSecao}>Quantidade</Text>
        <View style={estilos.linhaQuantidade}>
          <TouchableOpacity
            style={estilos.botaoQtd}
            onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
          >
            <Text style={estilos.textoQtd}>-</Text>
          </TouchableOpacity>
          <Text style={estilos.numeroQtd}>{quantidade}</Text>
          <TouchableOpacity
            style={estilos.botaoQtd}
            onPress={() => setQuantidade((q) => q + 1)}
          >
            <Text style={estilos.textoQtd}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={estilos.botaoListaDesejos}
          onPress={salvarListaDesejos}
        >
          <Text style={estilos.textoBotaoListaDesejos}>Adicionar à Lista de Desejos</Text>
        </TouchableOpacity>

        <Text style={estilos.tituloSecao}>Cores disponíveis</Text>
        <View style={estilos.tags}>
          {coresDisponiveis.map((cor) => (
            <View key={cor} style={estilos.tag}>
              <Text style={estilos.textoTag}>{cor}</Text>
            </View>
          ))}
        </View>

        <Text style={estilos.tituloSecao}>Tamanhos disponíveis</Text>
        <View style={estilos.tags}>
          {tamanhosDisponiveis.map((tamanho) => (
            <View key={tamanho} style={estilos.tag}>
              <Text style={estilos.textoTag}>{tamanho}</Text>
            </View>
          ))}
        </View>

        <Text style={estilos.tituloSecao}>Calcular frete</Text>
        <TextInput
          placeholder="Digite um CEP"
          placeholderTextColor="#999"
          value={cep}
          onChangeText={(t) => setCep(t)}
          onBlur={() => validarCep(cep)}
          style={[estilos.input, erroCep && estilos.inputErro]}
          keyboardType="numeric"
          maxLength={9}
        />
        {erroCep ? <Text style={estilos.textoErro}>{erroCep}</Text> : null}

        <View style={{ marginTop: 10 }}>
          <Text style={estilos.subtitulo}>Método de entrega</Text>
          <View style={estilos.linhaEntrega}>
            <BotaoEntrega valor="Econômica" rotulo="Econômica" />
            <BotaoEntrega valor="Expressa" rotulo="Expressa" />
          </View>
          <Text style={estilos.textoFrete}>
            Frete estimado:{' '}
            <Text style={estilos.negrito}>R$ {calcularFrete().toFixed(2)}</Text>
          </Text>
        </View>

        <Text style={estilos.textoTotal}>
          Total: <Text style={estilos.negrito}>R$ {calcularTotal()}</Text>
        </Text>

        <TouchableOpacity style={estilos.botaoConfirmar} onPress={confirmarCompra}>
          <Text style={estilos.textoBotaoConfirmar}>Confirmar Compra</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Estilos ---
const estilos = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  imagem: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  saudacao: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#800000',
  },
  nome: { fontSize: 24, fontWeight: '700', color: '#800020', marginBottom: 6 },
  preco: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 10 },
  descricao: { fontSize: 14, color: '#333', marginBottom: 20 },

  tituloSecao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#800020',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5E5E5',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  textoTag: { color: '#800020', fontWeight: '600' },

  linhaQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoQtd: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#800020',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDECEC',
  },
  textoQtd: { fontSize: 20, fontWeight: '700', color: '#800020' },
  numeroQtd: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 15,
    color: '#333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 6,
    color: '#333',
  },
  inputErro: { borderColor: '#e74c3c', backgroundColor: '#fffef6' },
  textoErro: { color: '#e74c3c', fontSize: 12 },

  linhaEntrega: { flexDirection: 'row', gap: 10, marginTop: 4 },
  botaoEntrega: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  botaoEntregaAtivo: { borderColor: '#800020', backgroundColor: '#FDECEC' },
  textoEntrega: { color: '#333', fontWeight: '600' },
  textoEntregaAtivo: { color: '#800020' },

  textoFrete: { marginTop: 8, fontSize: 14, color: '#333' },
  textoTotal: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  negrito: { fontWeight: '800' },

  botaoConfirmar: {
    marginVertical: 15,
    padding: 14,
    backgroundColor: '#800020',
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoConfirmar: { color: '#fff', fontSize: 16, fontWeight: '700' },

  botaoListaDesejos: {
    marginVertical: 10,
    padding: 14,
    backgroundColor: '#800000',
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoListaDesejos: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});