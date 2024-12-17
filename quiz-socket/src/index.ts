import express from 'express';
import { Kafka } from 'kafkajs';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.APP_NAME;
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS! as string).split(',');
const KAFKA_TOPIC = process.env.KAFKA_TOPIC!;

const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: KAFKA_BROKERS,
});

const consumer = kafka.consumer({ groupId: randomUUID() });

const wss = new WebSocketServer({ noServer: true });

// Map that stores by quizId-userName-WebSocket
const connectionMap = new Map<string, Map<string, any>>();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    let userName: string;

    // Handle messages received from the client
    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);
        const payload = JSON.parse(message.toString()) as ISubscriptionEvent;
        userName = payload.userName;

        if (payload.type === 'subscribe') {
            let quizConnections = connectionMap.get(payload.quizId);
            if (!quizConnections) {
                quizConnections = new Map<string, any>();
                connectionMap.set(payload.quizId, quizConnections);
            }
            quizConnections.set(payload.userName, ws);
        } else if (payload.type === 'unsubscribe') {
            let quizConnections = connectionMap.get(payload.quizId);
            if (quizConnections) {
                quizConnections.delete(payload.userName);
            }
        } else {
            console.log('Does not support this event');
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (userName) {
            for (const quizConnections of connectionMap.values()) {
                quizConnections.delete(userName);
            }
        }
    });
});

const run = async () => {
    await consumer.connect();
    console.log('Connected to Kafka');

    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: false });

    // Run the consumer
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message: ${message.value?.toString()} from topic: ${topic}`);
            if (message.value) {
                const realtimeEvent = JSON.parse(message.value?.toString()) as IRealtimeEvent;
                const quizSubscribers = connectionMap.get(realtimeEvent.payload?.quizId);
                console.log('Quiz id', realtimeEvent.payload?.quizId);
                console.log('Subscriber size', quizSubscribers?.size);
                if (quizSubscribers) {
                    for (const connection of quizSubscribers.values()) {
                        console.log(JSON.stringify(connection));
                        connection.send(JSON.stringify(realtimeEvent));
                    }
                }
            }
        },
    });
};

// Start the consumer
run().catch(console.error);

// Create a server to integrate WebSocket with the Express app
const server = app.listen(PORT, () => {
    console.log(`HTTP Server is running on http://localhost:${PORT}`);
});

// Upgrade the server to handle WebSocket connections
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Set up a simple Express server
app.get('/', (req, res) => {
    res.send('Quiz realtime service is running!');
});

 