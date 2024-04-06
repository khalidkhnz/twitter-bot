"use client";
import {
  accessTokenAction,
  requestTokenAction,
  sendTweetAction,
} from "@/action/CollectAuths.action";
import React, { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [tweet, setTweet] = useState("");

  const [token, setToken] = useState("");
  const [oAuthRequestToken, setOAuthRequestToken] = useState({});
  const [pin, setPin] = useState("");
  const [accessToken, setAccessToken] = useState({});

  // const API_BASE = process.env.API_BASE || "http://localhost:4000/";
  const authorizeURL = `https://api.twitter.com/oauth/authorize?oauth_token=${token}`;

  async function requestToken() {
    try {
      let response = await requestTokenAction();
      response = await JSON.parse(response);
      // let response = await fetch(`${API_BASE}request-token`);
      // response = await response.json();
      setToken(response?.token);
      setOAuthRequestToken(response?.oAuthRequestToken);
      console.log(response);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  async function handleVerifyPin() {
    try {
      let response = await accessTokenAction(oAuthRequestToken, pin);
      response = await JSON.parse(response);
      setAccessToken(response?.oAuthAccessToken);
      if (response?.success) toast.success(response?.message);
      else toast.error(response?.message);
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
      let response = await sendTweetAction(tweet);
      response = await JSON.parse(response);
      console.log(response);
      alert(`${response.sentTweet}`);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h2>STEP 1</h2>
        <button
          style={{
            width: "200px",
            height: "50px",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "10px",
            margin: "10px",
            textTransform: "capitalize",
            cursor: "pointer",
          }}
          onClick={requestToken}
        >
          Request A Token
        </button>
      </div>
      {token && (
        <div>
          <h2>Token</h2>
          <p>{`${token}`}</p>
        </div>
      )}

      <div
        style={{
          borderBottom: "1px solid #fff",
          width: "60%",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      ></div>

      {token && (
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>STEP 2</h2>

          <h2>Authorization URL</h2>
          <p>{`${authorizeURL}`}</p>
          <a
            style={{
              // padding: "20px",
              // margin: "20px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: "200px",
              minHeight: "50px",
              backgroundColor: "#fff",
              color: "#000",
              margin: "10px",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
            href={`${authorizeURL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go And Authorize
          </a>
        </div>
      )}

      <div
        style={{
          borderBottom: "1px solid #fff",
          width: "60%",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      ></div>

      {token && (
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>STEP 3</h2>

          <h2>Enter Pin</h2>
          <input
            type="text"
            style={{ padding: "8px" }}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
          />
          <button
            style={{
              background: "#90EE90",
              padding: "20px",
              marginTop: "5px",
              borderRadius: "8px",
            }}
            onClick={handleVerifyPin}
          >
            Verify and get Access Token
          </button>
        </div>
      )}
      {/* <div>
        <button onClick={logAll}>LOG ALL DEV</button>
      </div> */}

      {/* <div>
        <input
          type="text"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
        />
        <button onClick={handleSendTweet}>Send Tweet From All Accounts</button>
      </div> */}
      <div
        style={{
          borderBottom: "1px solid #fff",
          width: "60%",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      ></div>

      <a
        style={{
          // padding: "20px",
          // margin: "20px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          width: "200px",
          minHeight: "40px",
          backgroundColor: "red",
          color: "#fff",
          margin: "10px",
          textTransform: "capitalize",
          cursor: "pointer",
        }}
        href="/collect-tokens"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reset
      </a>
    </div>
  );
};

export default Home;
