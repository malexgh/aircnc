import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, AsyncStorage, Image } from 'react-native';
import SpotList from '../components/SpotList';
import logo from '../assets/logo.png';

export default function List() {
    const [techs, setTechs] = useState([]);

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
            {techs.map((tech)=><SpotList key={tech} tech={tech} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
    },
    logo: {
        height: 32,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 30,
    },
});
