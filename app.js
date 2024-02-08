<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Messages Display</title>
</head>
<body>

  <div id="messages-container"></div>

  <script>
    // Function to fetch and display messages
    async function fetchAndDisplayMessages() {
      try {
        // Make a request to your GraphQL endpoint
        const response = await fetch('http://localhost:3000', {
          method: 'GET',
          headers: {
            'Content-Type': 'text/html',
          },
        });

        const data = await response.text();
        
        // Display messages on the web page
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = data;

      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }

    // Call the function to fetch and display messages
    fetchAndDisplayMessages();
  </script>

</body>
</html>
