import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';
import './styles.css';

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const user_id = localStorage.getItem('user');
        const socket = socketio('http://localhost:3333', { query: { user_id } });
        socket.on('booking_request', (data) => {
            console.log(data);
            setRequests((prevState) => [...prevState, data]);
        });
    }, []);

    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: {
                    user_id
                }
            });
            //console.log(response.data);
            setSpots(response.data);
        }
        loadSpots();
    }, []);

    async function handleAccept(id) {
        console.log('Accept', id);
        const user_id = localStorage.getItem('user');
        console.log('Accept', user_id);
        try {
            const response = await api.post(`/bookings/${id}/approvals`, {/*empty*/ }, {
                headers: {
                    user_id
                }
            });
            console.log('Accept', response.status, response.data);
            if (response.status === 201) {
                setRequests((prevState) => prevState.filter((item) => item._id !== id));
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function handleReject(id) {
        console.log('Reject', id);
        const user_id = localStorage.getItem('user');
        console.log('Reject', user_id);
        try {
            const response = await api.post(`/bookings/${id}/rejections`, {/*empty*/ }, {
                headers: {
                    user_id
                }
            });
            console.log('Reject', response.status, response.data);
            if (response.status === 201) {
                setRequests((prevState) => prevState.filter((item) => item._id !== id));
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Fragment>
            <ul className="notifications">
                {requests.map((request) =>
                    <li key={request._id}>
                        <p><strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data <strong>{request.date}</strong></p>
                        <button className="accept" onClick={() => handleAccept(request._id)}>Aceitar</button>
                        <button className="reject" onClick={() => handleReject(request._id)}>Rejeitar</button>
                    </li>
                )}
            </ul>
            <ul className="spot-list">
                {spots.map((spot) => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$${spot.price}/dia` : 'Gratuito'}</span>
                    </li>
                ))}
            </ul>
            <Link to="/new">
                <button className="btn">Cadastrar novo Spot</button>
            </Link>
        </Fragment>
    );
}
