const db = require('./db');
const { fetchAllCardBacks } = require('./fetchCardBacks');

// Store card backs in database.


async function storeCardBacks() {
    const cardBacks = await fetchAllCardBacks();

    for (const cardBack of cardBacks) {
        const { id, name, text, image, slug, sortCategory } = cardBack;

        await db.query(
            `INSERT INTO CardBacks (id, name, text, image_url, sort_category, slug)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE
            SET name = EXCLUDED.name,
                text = EXCLUDED.text,
                image_url = EXCLUDED.image_url,
                sort_category = EXCLUDED.sort_category,
                slug = EXCLUDED.slug;`,
            [id, name, text, image, sortCategory, slug]
        );
    }

    console.log('Card backs data has been stored/updated successfully.');
}

storeCardBacks().catch(err => console.error(err));
