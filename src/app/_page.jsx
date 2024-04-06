"use client";
import React, { useState } from "react";

const Home = () => {
  const [tweet, setTweet] = useState("");

  const [token, setToken] = useState("");
  const [oAuthRequestToken, setOAuthRequestToken] = useState({});
  const [pin, setPin] = useState("");
  const [accessToken, setAccessToken] = useState({});

  const API_BASE = process.env.API_BASE || "http://localhost:4000/";
  const authorizeURL = `https://api.twitter.com/oauth/authorize?oauth_token=${token}`;

  async function requestToken() {
    try {
      let response = await fetch(`${API_BASE}request-token`);
      response = await response.json();
      setToken(response?.token);
      setOAuthRequestToken(response?.oAuthRequestToken);
      console.log(response);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async function handleVerifyPin() {
    try {
      let response = await fetch(`${API_BASE}access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oAuthRequestToken: oAuthRequestToken,
          pin: pin,
        }),
      });
      response = await response.json();
      setAccessToken(response?.oAuthAccessToken);
      console.log(response);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async function logAll() {
    console.log("Token : ", token);
    console.log("OAuthRequestToken : ", oAuthRequestToken);
    console.log("AccessToken : ", accessToken);
    console.log("Pin : ", pin);
  }

  async function handleSendTweet() {
    try {
      let response = await fetch(`${API_BASE}send-tweet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: tweet,
        }),
      });
      response = await response.json();
      console.log(response);
      alert(`${response.sentTweet}`);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  return (
    <div>
      <div>
        <button onClick={requestToken}>Request Token</button>
      </div>
      {token && (
        <div>
          <h2>Token</h2>
          <p>{`${token}`}</p>
        </div>
      )}

      {token && (
        <div>
          <h2>Authorization URL</h2>
          <p>{`${authorizeURL}`}</p>
          <a href={`${authorizeURL}`} target="_blank" rel="noopener noreferrer">
            GO AND AUTHORIZE
          </a>
        </div>
      )}

      {token && (
        <div>
          <h2>Enter Pin</h2>
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
          />
          <button onClick={handleVerifyPin}>Verify and get Access Token</button>
        </div>
      )}
      <div>
        <button onClick={logAll}>LOG ALL</button>
      </div>

      <div>
        <input
          type="text"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
        />
        <button onClick={handleSendTweet}>Send Tweet From All Accounts</button>
      </div>
    </div>
  );
};

export default Home;
