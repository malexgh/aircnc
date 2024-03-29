import React, { useState, Fragment } from 'react';
import api from '../../services/api';

export default function Login({ history }) {
    const [email, setEmail] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await api.post('/sessions', { email });
        if (response.status === 200 || response.status === 201) {
            const { _id } = response.data;
            localStorage.setItem('user', _id);
            history.push('/dashboard');
        }
    }

    return (
        <Fragment>
            <p>Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <button className="btn" type="submit">Entrar</button>
            </form>
        </Fragment>
    );
}
