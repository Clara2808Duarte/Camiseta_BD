import { useState, useEffect } from "react"
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet} from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SQLite from "expo-sqlite"

import CamisetaSP from "../assets/SP(Frente).png"
import CamisetaCorinthians from "../assets/COR(Frente).png"
import CamisetaFlamengo from "../assets/FLA(Frente).png"
import CamisetaPalmeiras from "../assets/PAL(Frente).png"
import CamisetaBotafogo from "../assets/BOT(frente).png"
import CamisetaChelsea from "../assets/CHEL(Frente).png"
import CamisetaRM from "../assets/REAL(Frente).png"
import CamisetaPSG from "../assets/PARIS(Frente).png"
import CamisetaMC from "../assets/MAN(Frente).png"
import CamisetaLiverpool from "../assets/LI(Frente).png"

const camisetasFixas = [
    { id: "1", nome: "Palmeiras 2025", imagem: CamisetaPalmeiras },
    { id: "2", nome: "Flamengo 2025", imagem: CamisetaFlamengo },
    { id: "3", nome: "São Paulo 2025", imagem: CamisetaSP },
    { id: "4", nome: "Corinthians 2025", imagem: CamisetaCorinthians },
    { id: "5", nome: "Botafogo 2025", imagem: CamisetaBotafogo },
    { id: "6", nome: "Chelsea 2025", imagem: CamisetaChelsea },
    { id: "7", nome: "Real Madrid 2025", imagem: CamisetaRM },
    { id: "8", nome: "Liverpool 2025", imagem: CamisetaLiverpool },
    { id: "9", nome: "Paris Saint-Germain 2025", imagem: CamisetaPSG },
    { id: "10", nome: "Manchester United 2025", imagem: CamisetaMC },
];

export default function TelaCatalogo({ navigation }) {
    const [apelido, setApelido] = useState("");
    const [camisetas, setCamisetas] = useState(camisetasFixas)

    useEffect(() => {
        const carregarUsuario = async () => {
            const salvo = await AsyncStorage.getItem("usuarioLogado")
            if (salvo) setApelido(salvo)
        }
        carregarUsuario()
    }, []);

    useEffect(() => {
        const buscarCamsisetasBanco = async () => {
            const db = await SQLite.openDatabaseAsync("meu_banco.db")
            const result = await db.getAllAsync("SELECT * FROM camisetas")
            const camisetasBanco = result.map((item, idx) => ({
                id: `db_${item.id || idx}`,
                nome: item.nome,
                imagem: item.imagem,
            }));
            setCamisetas([...camisetasFixas, ...camisetasBanco])
        };
        buscarCamisetasBanco();
    }, []);

    return (
        <View style={style.container}>
            <Text style={style.saudacao}> Bem-vindo, {apelido}! </Text>
            <TouchableOpacity
                style={style.lista}
                onPress={() => navigation.navigate("ListaDeDesejos")}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Lista de Desejos ♥
                </Text>
            </TouchableOpacity>

            <FlatList
                data={camisetas}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={style.item}
                        onPress={() => navigation.navigate("Detalhes", { produto: item })}
                    >
                        {item.imagem && item.imagem === "string" ? (
                            <Image source={{ uri: item.imagem }} style={estilos.imagem} />
                        ) : (
                            <Image source={item.imagem} style={estilos.imagem} />
                        )}
                        <Text style={estilos.nome}>{item.nome}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: "#fff" },
    saudacao: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: "#800000",
    },
    item: {
        flex: 1,
        margin: 6,
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: "#800000",
    },
    imagem: { 
        width: 120, 
        height: 120, 
        resizeMode: "contain" 
    },
    nome: {
        marginTop: 8,
        fontWeight: "700",
        color: "#800000",
        textAlign: "center",
    },
    lista: {
        backgroundColor: "#800000",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
