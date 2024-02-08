// app.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const graphqlQuery = `
  query MessagesByUpdateAt {
    messagesByUpdateAt(type: "message", sortDirection: DESC, limit: 2000) {
      items {
        id
        message
        channelId
        createdAt
        updatedAt
        userMessagesId
        type
        author {
          givenName
          familyName
          nickname
          profileImage
        }
      }
    }
  }
`;

const headers = {
  'x-api-key': process.env.API_KEY,
  'Content-Type': 'application/json',
};

const config = {
  headers: headers,
  responseType: 'json',
};

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const response = await axios.post(
      process.env.GRAPHQL_URL,
      { query: graphqlQuery },
      config
    );

    console.log('GraphQL Response:', response.data);

    const messages = response.data.data.messagesByUpdateAt.items;

    const messagesHTML = messages.map(message => {
      const author = message.author || {}; // Handle null author

      const createdAt = new Date(message.createdAt).toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
      });

      return `
        <p>
          <strong>${author.givenName || 'Unknown'}:</strong> 
          ${message.message} - Created at: ${createdAt}
        </p>
      `;
    }).join('');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Messages</title>
      </head>
      <body>
        <h1>Messages</h1>
        ${messagesHTML}
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
