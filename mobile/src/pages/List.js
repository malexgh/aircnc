import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, AsyncStorage, Image, Alert } from 'react-native';
import socketio from 'socket.io-client';
import SpotList from '../components/SpotList';
import logo from '../assets/logo.png';

export default function List() {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        async function prepareSocket() {
            const user_id = await AsyncStorage.getItem('user');
            const socket = socketio('http://localhost:3333', { query: { user_id } });
            socket.on('booking_response', (booking) => {
                console.log(booking);
                Alert.alert(`Sua reserva em ${booking.spot.company} na data ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}!`);
            });
        }
        prepareSocket();
    }, []);

    useEffect(() => {
        async function loadTechs() {
            const techsText = await AsyncStorage.getItem('techs');
            const techsList = techsText.split(',').map((tech) => tech.trim());
            console.log(techsText, ' => ', techsList);
            setTechs(techsList);
        }
        loadTechs();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <ScrollView>
                {techs.map((tech) => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 30,
    },
});
