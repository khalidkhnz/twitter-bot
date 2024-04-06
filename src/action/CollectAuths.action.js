"use server";

import { addTokenToMONGO } from "@/db/addTokenToMONGO.action";
require("dotenv").config();
const crypto = require("crypto"); // Cryptographic library
const Oauth = require("oauth-1.0a"); // OAuth 1.0a library
const qs = require("querystring"); // Query string library
const { URLSearchParams } = require("url"); // URL handling library
const addTokenToArrayToFile = require("./saveToken");
const storedToken = require("../../tokens.json");

////////////////////////
const oauth = Oauth({
  consumer: {
    key: process.env.CONSUMER_KEY,
    secret: process.env.CONSUMER_SECRET,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) =>
    crypto.createHmac("sha1", key).update(baseString).digest("base64"),
});
///////////////////////

///////////////////////////////
async function requestToken() {
  try {
    const requestTokenURL =
      "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write";
    const authHeader = oauth.toHeader(
      oauth.authorize({
        url: requestTokenURL,
        method: "POST",
      })
    );

    const request = await fetch(requestTokenURL, {
      method: "POST",
      headers: {
        Authorization: authHeader["Authorization"],
      },
    });
    const body = await request.text();

    return Object.fromEntries(new URLSearchParams(body));
  } catch (error) {
    console.error("Error:", error);
  }
}
///////////////////////////////

/////////////////////////////////
async function accessToken({ oauth_token, oauth_secret }, verifier) {
  try {
    const url = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;
    const authHeader = oauth.toHeader(
      oauth.authorize({
        url,
        method: "POST",
      })
    );

    const request = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader["Authorization"],
      },
    });
    const body = await request.text();
    return Object.fromEntries(new URLSearchParams(body));
  } catch (error) {
    console.error("Error:", error);
  }
}
/////////////////////////////////

////////////////////////////
async function saveTokenToDB(token) {
  let res = await addTokenToMONGO(token);
  addTokenToArrayToFile("tokens.json", token);
  console.log("Token saved to tokens.json");
  return res;
}
///////////////////////////

/////////////////////////////
async function writeTweet({ oauth_token, oauth_token_secret }, tweet) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const url = "https://api.twitter.com/2/tweets";

  const headers = oauth.toHeader(
    oauth.authorize(
      {
        url,
        method: "POST",
      },
      token
    )
  );

  try {
    const request = await fetch(url, {
      method: "POST",
      body: JSON.stringify(tweet),
      responseType: "json",
      headers: {
        Authorization: headers["Authorization"],
        "user-agent": "V2CreateTweetJS",
        "content-type": "application/json",
        accept: "application/json",
      },
    });
    const body = await request.json();
    return body;
  } catch (error) {
    console.error("Error:", error);
  }
}
/////////////////////////////

// router.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ environment: "development", twitterBot: "Khalid's Bot" });
// });
async function GetHomeAPI() {
  return JSON.stringify({
    environment: "development",
    twitterBot: "Khalid's Bot",
  });
}

// router.get("/twitter", (req, res) => {
//   res.status(200).json({ message: "Hello from Twitter!" });
// });

// router.get("/request-token", async (req, res) => {
//   const oAuthRequestToken = await requestToken();
//   res.status(200).json({
//     token: oAuthRequestToken.oauth_token,
//     oAuthRequestToken: oAuthRequestToken,
//   });
// });

async function requestTokenAction() {
  const oAuthRequestToken = await requestToken();
  return JSON.stringify({
    token: oAuthRequestToken.oauth_token,
    oAuthRequestToken: oAuthRequestToken,
  });
}

// router.post("/access-token", async (req, res) => {
//   //   const pin = req.params.pin;
//   const { oAuthRequestToken, pin } = req.body;

//   const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
//   saveTokenToDB(oAuthAccessToken);
//   res.status(200).json({ oAuthAccessToken });
// });

async function accessTokenAction(oAuthRequestToken, pin) {
  const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
  let res = await saveTokenToDB(oAuthAccessToken);
  return JSON.stringify({
    oAuthAccessToken,
    success: res.success,
    message: res.message,
  });
}

// router.post("/send-tweet", async (req, res) => {
//   const { text } = req.body;
//   let responseArray = [];
//   let screenNames = [];

//   // Create an array of promises using map
//   const tweetPromises = storedToken.map(async (token) => {
//     const messageResponse = await writeTweet(token, {
//       text: text,
//     });
//     responseArray.push(messageResponse);
//     screenNames.push(token.screen_name);
//     console.log("Using Auth : ", token.screen_name);
//   });

//   // Wait for all promises to resolve
//   await Promise.all(tweetPromises);

//   res.status(200).json({ sentTweet: text, responseArray, screenNames });
// });

async function sendTweetAction(text) {
  let responseArray = [];
  let screenNames = [];

  // Create an array of promises using map
  const tweetPromises = storedToken.map(async (token) => {
    const messageResponse = await writeTweet(token, {
      text: text,
    });
    responseArray.push(messageResponse);
    screenNames.push(token.screen_name);
    console.log("Using Auth : ", token.screen_name);
  });

  // Wait for all promises to resolve
  await Promise.all(tweetPromises);

  return JSON.stringify({ sentTweet: text, responseArray, screenNames });
}

// router.get("/send-image-tweet", async (req, res) => {
//   res.status(200).json({ success: true });
// });

async function sendImageTweet() {
  return JSON.stringify({ success: true });
}

export { GetHomeAPI, requestTokenAction, accessTokenAction, sendTweetAction };

// module.exports = router;
