import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import dayjs from "dayjs";
import { Paper, Grid, Typography, useMediaQuery } from "@mui/material";

function App() {
  const [location, setLocation] = useState(false); //vai verificar se o usuario aprovou o acesso a localização
  const [weather, setWeather] = useState(false); //vai armazenar os dados da API
  let hour = dayjs().format("HH:mm");
  let verification = hour >= "06:00" && hour <= "18:00" ? true : false;

  const isMobile = useMediaQuery("(max-width:600px)");

  const getWeather = async (latitude, longitude) => {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: import.meta.env.VITE_REACT_APP_OPEN_WEATHER_KEY,
          units: "metric",
          lang: "pt_br",
        },
      }
    );
    setWeather(response.data); //atualiza o weather pra true e mostra os dados recebidos da API
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      //solicita a localização no navegador
      getWeather(position.coords.latitude, position.coords.longitude);
      setLocation(true);
    });
  }, []);

  if (location == false) {
    return (
      <Typography variant="h6">
        Você precisa habilitar sua localização
      </Typography>
    );
  } else if (weather == false) {
    //só vai exibir depois que o weather não for mais false
    return (
      <Typography variant="h6">Carregando informações de clima...</Typography>
    );
  } else {
    return (
      <Grid container justifyContent="center">
        <Grid item height={isMobile ? "60vh" : "100vh"} width={isMobile ? "60vw" : "40vw"}>
          <Paper elevation={3} className={verification ? "day" : "night"}>
            <h3>Clima da cidade de {weather["name"]}</h3>
            <p>Atualmente {weather["weather"][0]["description"]}</p>
            <ul>
              <li>Temperatura atual: {parseInt(weather["main"]["temp"])}º</li>
              <li>Temperatura maxima: {parseInt(weather["main"]["temp_max"])}º</li>
              <li>Temperatura minima: {parseInt(weather["main"]["temp_min"])}º</li>
              <li>Sensação de: {parseInt(weather["main"]["feels_like"])}</li>
              <li>Umidade: {weather["main"]["humidity"]}%</li>
              <li>Velocidade do vento: {weather["wind"]["speed"]}</li>
            </ul>
            <p>Hora atual: {hour}</p>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default App;
