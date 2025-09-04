import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
// Importa a instância do banco de dados SQLite
import { db } from "../db";

export default function TelaListar() {
  // Estado que guarda o valor digitado no campo de busca
  const [filtro, setFiltro] = useState(""); 
  // Estado que guarda os resultados da consulta (lista de camisetas encontradas)
  const [resultado, setResultado] = useState([]);
  // Estado que define se a busca será por "nome" ou por "cor"
  const [modo, setModo] = useState("nome"); 

  // Função que executa a consulta no banco
  const buscar = () => {
    let query = "";   // Variável que vai armazenar o comando SQL
    let params = [];  // Array com os parâmetros da consulta

    // Se o modo for "nome", busca camisetas pelo nome
    if (modo === "nome") {
      query = "SELECT * FROM camisetas WHERE nome LIKE ?";
      params = [`%${filtro}%`]; // Usando LIKE com % para buscar qualquer parte do nome
    } 
    // Caso contrário, busca camisetas pela cor
    else {
      query = "SELECT * FROM camisetas WHERE cor LIKE ?";
      params = [`%${filtro}%`];
    }

    // Executa a transação no banco
    db.transaction((tx) => {
      // Executa a query definida acima
      tx.executeSql(query, params, (_, { rows }) => 
        // rows._array é o array com os resultados encontrados
        setResultado(rows._array)
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Campo de texto para digitar o filtro (nome ou cor) */}
      <TextInput
        placeholder={`Digite o ${modo}`} // Troca dinamicamente entre "nome" ou "cor"
        value={filtro}                   // Valor atual digitado
        onChangeText={setFiltro}         // Atualiza o estado quando digita
        style={styles.input}             // Aplica estilo
      />

      {/* Área com dois botões: um para buscar por nome e outro por cor */}
      <View style={styles.buttons}>
        {/* Botão para buscar por nome */}
        <Button 
          title="Buscar por Nome" 
          onPress={() => { 
            setModo("nome"); // Define o modo como "nome"
            buscar();        // Chama a função de busca
          }} 
        />
        {/* Botão para buscar por cor */}
        <Button 
          title="Buscar por Cor" 
          onPress={() => { 
            setModo("cor");  // Define o modo como "cor"
            buscar();        // Chama a função de busca
          }} 
        />
      </View>

      {/* Lista que exibe os resultados da busca */}
      <FlatList
        data={resultado}                       // Fonte de dados (camisetas encontradas)
        keyExtractor={(item) => item.id.toString()} // Define a chave única de cada item
        renderItem={({ item }) => (            // Como cada item será exibido
          <Text style={styles.item}>
            {item.nome} - {item.cor}           {/* Exibe nome e cor da camiseta */}
          </Text>
        )}
      />
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },                         // Container principal
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }, // Campo de texto
  buttons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }, // Botões lado a lado
  item: { padding: 10, fontSize: 18, borderBottomWidth: 1 },   // Estilo dos itens da lista
});
