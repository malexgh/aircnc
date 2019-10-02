import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import camera from '../../assets/camera.svg';
import './styles.css';

export default function New({ history }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [company, setCompany] = useState('');
  const [techs, setTechs] = useState('');
  const [price, setPrice] = useState('');

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function handleSubmit(event) {
    event.preventDefault();
    const user_id = localStorage.getItem('user');
    const data = new FormData(); //multipart, not json
    data.append('thumbnail', thumbnail);
    data.append('company', company);
    data.append('techs', techs);
    data.append('price', price);
    const response = await api.post('/spots', data, { headers: { user_id } });
    //console.log(response.data);
    if (response.status === 200) {
      history.push('/dashboard');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? 'has-thumbnail' : ''}
      >
        <input type="file" onChange={(event) => setThumbnail(event.target.files[0])} />
        <img src={camera} alt="Selecione a imagem" />
      </label>
      <label htmlFor="company">Empresa *</label>
      <input
        id="company"
        placeholder="Nome da empresa"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
      />
      <label htmlFor="techs">Tecnologias * <span>(separadas por vírgula)</span></label>
      <input
        id="techs"
        placeholder="Quais tecnologias usam?"
        value={techs}
        onChange={(event) => setTechs(event.target.value)}
      />
      <label htmlFor="price">Valor da Diária <span>(em branco para Gratuito)</span></label>
      <input
        id="comppriceany"
        placeholder="Valor cobrado por dia"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <button className="btn" type="submit">Cadastrar</button>
    </form>
  );
}
