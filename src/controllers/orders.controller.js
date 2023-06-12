import { db } from "../database/database.connection.js";
import dayjs from "dayjs";


export async function postOrder(req, res){

    const {clientId, cakeId, quantity} = req.body
    
    const clientExist = await db.query('SELECT * FROM clients WHERE id = $1', [clientId]);

    if(!clientExist.rows[0]) {
        return res.sendStatus(404);
    };
    const cakeExist = await db.query('SELECT * FROM cakes WHERE id = $1', [cakeId]);

    if(!cakeExist.rows[0]) {
        return res.sendStatus(404);
    };

    if(quantity < 0 || quantity > 5){
        return res.sendStatus(400);
    }

    const totalPrice = (cakeExist.rows[0].price) * quantity;
    const createdAt = dayjs().format('YYYY-MM-DD');

    try{
        await db.query(`INSERT INTO orders("clientId", "cakeId", quantity, "totalPrice", "createdAt") VALUES($1, $2, $3, $4, $5)`, [clientId, cakeId, quantity, totalPrice, createdAt]);
        return res.sendStatus(201);

    }catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getOrders(req, res){

    try{

    const completeOrders = await db.query(
        `SELECT orders.id AS "ordersId", orders."createdAt", orders.quantity, orders."totalPrice",
        cakes.id AS "cakeId", cakes.name AS "cakes", cakes.price, cakes.description, cakes.image,
        clients.id AS "clientId", clients.name AS "clientName", clients.address, clients.phone 
        FROM orders
        JOIN clients ON "clientId" = clients.id
        JOIN cakes ON "cakeId" = cakes.id`);

        const allCompleteOrders = completeOrders.rows.map((element) => {

            const completeOrdersData = {
                client: {
                    id: element.clientId,
                    name: element.clientName,
                    address: element.address,
                    phone: element.phone,
                  },
                  cake: {
                    id: element.cakeId,
                    name: element.cakes,
                    price: element.price,
                    description: element.description,
                    image: element.image,
                  },
                  orderId: element.ordersId,
                  createdAt: element.createdAt,
                  quantity: element.quantity,
                  totalPrice: element.totalPrice,
            }

            return completeOrdersData;
        });

        if(!completeOrders.rows[0]){
            return res.status(404).send([])
        }

        res.status(200).send(allCompleteOrders);

    }catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getOrdersId(req, res){

    const { id } = req.params

    try{

        const orderById = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    
        if (!orderById.rows[0]) {
            return res.sendStatus(404);
        }

        const clientOrderId = await db.query('SELECT * FROM clients WHERE id = $1', [clientId]);
        const cakeOrderId = await db.query('SELECT * FROM cakes WHERE id = $1', [cakeId]);

        const ordersData = {
            client: {
                id: clientOrderId.rows[0].id,
                name: clientOrderId.rows[0].name,
                address: clientOrderId.rows[0].address,
                phone: clientOrderId.rows[0].phone,
            },
            cake: {
                id: cakeOrderId.rows[0].id,
                name: cakeOrderId.rows[0].name,
                price: cakeOrderId.rows[0].price,
                description: cakeOrderId.rows[0].description,
                image: cakeOrderId.rows[0].image,
            },
            orderId: orderById.rows[0].id,
            createdAt: orderById.rows[0].createdAt,
            quantity: orderById.rows[0].quantity,
            totalPrice: orderById.rows[0].totalPrice
        }

    return res.status(200).send(ordersData);

    }catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}