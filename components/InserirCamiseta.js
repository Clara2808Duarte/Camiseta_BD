import {useState} from 'react'
import {StyleSheet, Text, TextInput, Button, Alert, ScrollView} from 'react-native'

import * as SQLite from 'expo-sqlite'

let db = null

async function openDb() {
    if (db) return db
    db = await
    SQLite.openDatabaseAsync('meu_banco.db')
    return db
}

const [nome, setNome] = useState('')
const [descricao, setDescricao] = useState('')
const [preco, setPreco] = useState('')
const [tamanho, setTamanho] = useState('')
const [cor, setCor] = useState('')
const [imagem, setImagem] = useState('')

const addCamiseta = async () => {
    if (!nome.trim() || !descricao.trim() || !preco.trim() || !tamanho.trim() || !cor.trim()) {
        Alert.alert('Erro!', 'Por favor, é necessário que todos os campos sejam preenchidos')
        return
    }

    try {
        const conn = await openDb()

        await conn.runAsync(
            'INSERT INTO (nome, descricao, preco, tamanho, cor, imagem) VALUES (?, ?, ?, ?, ?, ?)'
            [nome, descricao, parseFloat(preco), tamanho, cor, imagem || null]
        )
        Alert.alert('Sucesso!', 'Camiseta adicionada!')

        setNome('')
        setDescricao('')
        setPreco('')
        setTamanho('')
        setCor('')
        setImagem('')

    } catch (error) {
        Alert.alert('Erro ao adicionar a camiseta.')
        console.error('Erro ao inserir: ', error)
    }

return (
    <ScrollView style={style.container}>
        <Text style={style.texto}> Adicionar Camiseta 👕 </Text>

        <TextInput
        style={style.input}
        placeholder="Nome do Time"
        value={nome}
        onChangeText={setNome}
        />

        <TextInput
        style={style.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        />

        <TextInput
        style={style.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
        />

        <TextInput
        style={style.input}
        placeholder="Tamanhos"
        value={tamanho}
        onChangeText={setTamanho}
        />

        <TextInput
        style={style.input}
        placeholder="Cores"
        value={cor}
        onChangeText={setCor}
        />

        <TextInput
        style={style.input}
        placeholder="URL da imagem (opicional)"
        value={imagem}
        onChangeText={setImagem}
        />

    <Button tittle="Adicionar Camiseta" onPress={addCamiseta}/>
    </ScrollView>
)
}

const style = StyleSheet.create({
    container: {
        flexGrow: 1, // Faz o ScrollView ocupar espaço suficiente
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
        title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        }
})