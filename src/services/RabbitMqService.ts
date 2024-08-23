import amqp, { Connection, Channel } from 'amqplib';


class RabbitMqService {

  private connection!: Connection;
  private channel!: Channel;
  private readonly queue = 'userQueue'
  private readonly reclamationQueue = 'reclQueue'; 
  private latestReclamationId: string | null = null;

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true ,  arguments: { 'x-queue-type': 'quorum' }});
    await this.channel.assertQueue(this.reclamationQueue, { durable: true, arguments: { 'x-queue-type': 'quorum' } });
  }

  async sendUserId(userId: string) {
    this.channel.sendToQueue(this.queue, Buffer.from(userId), { persistent: true });
    console.log(`j'ai envoyer userId a springboot ${this.queue}: ${userId}`);
  }


  async receiveReclamationId() {
    this.channel.consume(this.reclamationQueue, (msg) => {
      if (msg) {
        const reclamationId = msg.content.toString();
        this.latestReclamationId = reclamationId; // Stocker le dernier ID reçu
        console.log(`Received Reclamation ID: ${this.latestReclamationId}`);
        this.channel.ack(msg); // Confirmer le traitement du message
      }
    }, {
      noAck: false  // Assurez-vous que les messages ne sont pas automatiquement confirmés
    });
  }

  // Nouvelle méthode pour obtenir le dernier ID reçu
  getLatestReclamationId() {
    return this.latestReclamationId;
  }

  
  async close() {
    await this.channel.close();
    await this.connection.close()
  }


}

export const rabbitMQService = new RabbitMqService();