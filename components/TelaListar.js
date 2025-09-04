import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import { db } from "../db";

export default function TelaListar() {
  const [filtro, setFiltro] = useState(""); // valor digitado
  const [resultado, setResultado] = useState([]);
  const [modo, setModo] = useState("nome"); // alterna entre 'nome' e 'cor'

  const buscar = () => {
    let query = "";
    let params = [];

    if (modo === "nome") {
      query = "SELECT * FROM camisetas WHERE nome LIKE ?";
      params = [`%${filtro}%`];
    } else {
      query = "SELECT * FROM camisetas WHERE cor LIKE ?";
      params = [`%${filtro}%`];
    }

    db.transaction((tx) => {
      tx.executeSql(query, params, (_, { rows }) => setResultado(rows._array));
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={`Digite o ${modo}`}
        value={filtro}
        onChangeText={setFiltro}
        style={styles.input}
      />

      <View style={styles.buttons}>
        <Button title="Buscar por Nome" onPress={() => { setModo("nome"); buscar(); }} />
        <Button title="Buscar por Cor" onPress={() => { setModo("cor"); buscar(); }} />
      </View>

      <FlatList
        data={resultado}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.nome} - {item.cor}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  item: { padding: 10, fontSize: 18, borderBottomWidth: 1 },
});
