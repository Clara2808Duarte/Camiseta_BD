// components/ListaDeDesejos.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDB, listWishlist, removeFromWishlist } from '../database/db';

export default function ListaDeDesejos() {
  const [usuario, setUsuario] = useState('');
  const [itens, setItens] = useState([]);

  const carregar = async () => {
    initDB();
    const u = await AsyncStorage.getItem('usuarioLogado');
    setUsuario(u || '');
    if (u) {
      const rows = await listWishlist(u);
      setItens(rows);
    } else {
      setItens([]);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (productId) => {
    if (!usuario) return;
    await removeFromWishlist(usuario, productId);
    await carregar();
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={() => remover(item.productId)}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minha Lista de Desejos</Text>
      <FlatList
        data={itens}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#666' }}>
            Nenhum item salvo.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC', padding: 16 },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#800000',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#80000022',
  },
  nome: { fontSize: 16, fontWeight: '600', color: '#333' },
  preco: { fontSize: 14, color: '#555', marginTop: 4 },
  btnExcluir: {
    backgroundColor: '#800000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
