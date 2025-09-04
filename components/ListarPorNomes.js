import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import { db } from "../db";

export default function ListarPorNome() {
  const [nome, setNome] = useState("");
  const [resultado, setResultado] = useState([]);

  const buscar = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM camisetas WHERE nome LIKE ?",
        [`%${nome}%`],
        (_, { rows }) => setResultado(rows._array)
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite o nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <Button title="Buscar" onPress={buscar} />
      <FlatList
        data={resultado}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.nome}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  item: { padding: 10, fontSize: 18, borderBottomWidth: 1 },
});