require('dotenv').config();
const axios = require('axios');

// Fetches card backs from Battlenet API. 
// When being used it is moved to the backend folder.
// When not being used it is moved to the battlenet folder.

async function getAccessToken() {

    const response = await axios.post('https://oauth.battle.net/token', null, {
        params: {
            grant_type: 'client_credentials',
            client_id: process.env.BATTLE_NET_CLIENT_ID,
            client_secret: process.env.BATTLE_NET_CLIENT_SECRET
        }
    });
    return response.data.access_token;
}

async function fetchAllCardBacks() {
    const accessToken = await getAccessToken();
    let allCardBacks = [];
    let page = 1;
    const totalPages = 7;

    while (page <= totalPages) {
        const response = await axios.get(`${process.env.BATTLE_NET_API_URL}/hearthstone/cardbacks?sort=dateAdded%3Adesc&order`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                locale: process.env.LOCALE,
                page: page
            }
        });

        const { cardBacks } = response.data;
        if (cardBacks && cardBacks.length > 0) {
            allCardBacks = [...allCardBacks, ...cardBacks];
        } else {
            break; // No more data
        }

        page++;
    }
    console.log(allCardBacks)
    return allCardBacks;
}

module.exports = { fetchAllCardBacks };