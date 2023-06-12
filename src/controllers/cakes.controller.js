import { db } from "../database/database.connection.js";

async function createCake(req, res) {
    const { name, price, image, description } = req.body;

    if ((!name, !price, !image) || typeof description !== "string") {
        res.sendStatus(400);
        return;
    }

    try {
        const existingCake = await db.query(
            `SELECT * FROM cakes WHERE name = $1`, [name] );

        if (existingCake.rowCount > 0) {
            res.sendStatus(409);
            return;                    }

        await db.query( `INSERT INTO cakes (name, price, image, description) VALUES ($1, $2, $3, $4)`,
            [name, price, image, description]
        );
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(err.message);
    }
}

export { createCake };