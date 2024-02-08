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

    const messages = response.data.data.messagesByUpdateAt.items;

    // Function to convert URLs in the message to clickable links
    const formatMessage = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, url => `<a href="${url}" target="_blank">${url}</a>`);
    };

    const messagesHTML = messages.map(message => {
      const author = message.author || {};
      const createdAt = new Date(message.createdAt).toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
      });

      const formattedMessage = formatMessage(message.message);

      return `
        <p>
          <strong>${author.givenName || 'Unknown'}:</strong> 
          ${formattedMessage} - Created at: ${createdAt}
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
        <div id="messages-container">${messagesHTML}</div>

        <script>
          // Optionally, you can include client-side logic here
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
